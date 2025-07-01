import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';

const API_BASE = 'https://trasmapiback.hawkins.es/api';

export async function register(name, email, password, password_confirmation) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Registro exitoso. Revisa tu correo.');
    } else {
        alert('Error en registro: ' + JSON.stringify(data));
    }
}

export async function login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('ads_removed', data.ads_removed);
        return true;
    } else {
        alert('Error en login: ' + JSON.stringify(data));
    }
}

export async function loginWithApple() {
  return new Promise(async (resolve, reject) => {
    try {
      const authResponse = await SignInWithApple.authorize({
        scopes: ['email', 'fullName'],
      });

      const response = authResponse.response; // ✅ aquí está el contenido real

      if (!response) {
        alert('❌ No se recibió respuesta válida de Apple');
        return resolve(false);
      }
      if (!response.user || !response.identityToken) {
        alert('❌ Datos incompletos de Apple:\n' + JSON.stringify(response, null, 2));
        return resolve(false);
      }

      const { user, email, givenName, identityToken } = response;

      const safeEmail = email ?? `user-${user}@apple-user.local`;
      const safeName = givenName ?? `AppleUser-${user.slice(0, 6)}`;

      const res = await fetch(`${API_BASE}/auth/apple/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          apple_id: user,
          email: safeEmail,
          name: safeName,
          token: identityToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('ads_removed', data.ads_removed);
        resolve(true);
      } else {
        alert('❌ Error al iniciar sesión con Apple: ' + JSON.stringify(data));
        resolve(false);
      }
    } catch (error) {
      console.error('Error Apple Login:', error);
      alert('No se pudo completar el inicio de sesión con Apple. ¿Está habilitado en el dispositivo y en App Store Connect?');
      resolve(false);
    }
  });
}



export function loginWithGoogle() {
  return new Promise(async (resolve, reject) => {
    try {
      await Browser.open({ url: `${API_BASE}/auth/google/redirect` });

      const listener = App.addListener('appUrlOpen', async (data) => {
        const url = new URL(data.url);
        const token = url.searchParams.get('token');
        const ads_removed = url.searchParams.get('ads_removed');

        await Browser.close();
        listener.remove();

        if (token) {
          console.log('🚀 Token recibido:', token);
          console.log('🚀 Anuncios eliminados:', ads_removed);
          localStorage.setItem('token', token);
          localStorage.setItem('ads_removed', ads_removed);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function eliminarCuenta() {
  const confirmar = confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");

  if (!confirmar) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert("No has iniciado sesión.");
    return;
  }

  try {
    const res = await fetch('https://trasmapiback.hawkins.es/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('ads_removed');
      alert("✅ Cuenta eliminada correctamente.");
      window.toggleLoginLogoutButtons(false);
      location.href = '/';
    } else {
      const data = await res.json();
      alert("❌ Error al eliminar cuenta: " + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error("❌ Error eliminando cuenta:", error);
    alert("❌ Error inesperado: " + error.message);
  }
}


