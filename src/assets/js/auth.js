import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

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
