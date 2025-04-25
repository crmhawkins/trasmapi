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
    if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login correcto');
    } else {
        alert('Error en login: ' + JSON.stringify(data));
    }
}

export async function loginWithGoogle() {
    await Browser.open({ url: `${API_BASE}/auth/google/redirect` });

    App.addListener('appUrlOpen', async (data) => {
        const url = new URL(data.url);
        const token = url.searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            await Browser.close();
            alert('Login con Google correcto');
        }
    });
}
