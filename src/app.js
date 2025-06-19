import tortugas from './assets/js/tortugas.js';
import posidonias from './assets/js/posidonias.js';
import limpieza from './assets/js/limpieza.js';
import './assets/css/app.css';
import { register, login, loginWithGoogle } from './assets/js/auth.js';
import { showInterstitialAd } from './assets/js/ads.js';
import {initializePurchases ,quitarAnuncios } from './assets/js/compra.js';
import { init } from 'es-module-lexer';


if (!window.__APP_INITIALIZED__) {
    window.__APP_INITIALIZED__ = true;

    console.log('✅ Ejecutando app.js por primera vez');

    window.addEventListener('load', async function () {
        window.scrollTo({ top: 1, behavior: 'smooth' });

        window.toggleLoginLogoutButtons = toggleLoginLogoutButtons;
        window.isLoggedIn = isloggedIn;

        console.log('Iniciando el Juego... by Hawkins')
        const loader = document.querySelector(".intro_loader");
        const content = document.querySelector(".intro_content");
        const adsRemovedFlag = localStorage.getItem('ads_removed');
        const removeAdsBtn = document.getElementById('removeAdsBtn');
        
        if (adsRemovedFlag === 'true' || adsRemovedFlag === '1') {
            if (removeAdsBtn) {
                removeAdsBtn.style.display = 'none';
            }
        }
        setTimeout(() => {
            loader.style.display = "none";
            content.classList.remove("oculto");
        }, 1000);

        document.addEventListener('dblclick', function (event) {
            event.preventDefault();
        }, { passive: false });
        
        toggleLoginLogoutButtons(isloggedIn());
        tortugas();
        posidonias();
        await initializePurchases();
        limpieza();

        document.getElementById("addToHomeBtn").addEventListener("click", function () {
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 0);

            const gameAreass = document.getElementById('bodyArea');
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            // if (!isSafari) {
            //     if (gameAreass.requestFullscreen) {
            //         gameAreass.requestFullscreen();
            //     } else if (gameAreass.webkitRequestFullscreen) {
            //         gameAreass.webkitRequestFullscreen();
            //     } else if (gameAreass.msRequestFullscreen) {
            //         gameAreass.msRequestFullscreen();
            //     }
            // }

            document.getElementById("introScreen").style.display = 'none';
            document.getElementById("startScreen").style.display = 'flex';
        });

        // Funciones globales
        window.register = async function (name, email, password, password_confirmation) {
            try {
                const res = await register(name, email, password, password_confirmation);
                if (res) {
                    showAlert('Registro exitoso. Revisa tu correo.', 'success');
                    closeLoginOverlay();
                }
            } catch (error) {
                showAlert('Error en registro: ' + error, 'error');
            }
        };

        window.login = async function (email, password) {
            console.log(email, password);
            try {
                const res = await login(email, password);
                if (res) {
                    showAlert('Inicio de sesión exitoso', 'success');
                    closeLoginOverlay();
                    toggleLoginLogoutButtons(true); // <--- AQUI

                }
            } catch (error) {
                showAlert('Error en inicio de sesión: ' + error, 'error');
            }
        };

        window.loginWithGoogle = async function () {
            try {
                await loginWithGoogle();

                showAlert('Iniciado sesión con Google', 'success');
                closeLoginOverlay();
                toggleLoginLogoutButtons(true); // <--- AQUI

            } catch (error) {
                showAlert('Error con Google Login: ' + error, 'error');
            }
        };

        document.getElementById('openLoginBtn').addEventListener('click', function () {
            document.getElementById('loginOverlay').style.display = 'flex';
        });

        document.getElementById('toggleLoginRegister').addEventListener('click', function (e) {
            e.preventDefault();
            const isLoginVisible = document.getElementById('loginForm').style.display !== 'none';

            document.getElementById('loginForm').style.display = isLoginVisible ? 'none' : 'block';
            document.getElementById('registerForm').style.display = isLoginVisible ? 'block' : 'none';
            document.getElementById('formTitle').textContent = isLoginVisible ? 'Registro' : 'Iniciar sesión';
            document.getElementById('toggleText').textContent = isLoginVisible ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?';
            this.textContent = isLoginVisible ? 'Inicia sesión' : 'Regístrate';
        });

        document.getElementById('loginOverlay').addEventListener('click', function (e) {
            if (e.target.id === 'loginOverlay') {
                this.style.display = 'none';
            }
        });

        // Funciones auxiliares
        function showAlert(message, type = 'info') {
            const alertDiv = document.createElement('div');
            alertDiv.textContent = message;
            alertDiv.style.position = 'fixed';
            alertDiv.style.bottom = '50px';
            alertDiv.style.left = '50%';
            alertDiv.style.transform = 'translateX(-50%)';
            alertDiv.style.background = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3';
            alertDiv.style.color = 'white';
            alertDiv.style.padding = '12px 24px';
            alertDiv.style.borderRadius = '6px';
            alertDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            alertDiv.style.zIndex = '999999';
            alertDiv.style.fontSize = '16px';
            alertDiv.style.textAlign = 'center';
            alertDiv.style.animation = 'fadeInOut 4s ease';

            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.remove();
            }, 4000);
        }

        function closeLoginOverlay() {
            document.getElementById('loginOverlay').style.display = 'none';
        }
        
        function toggleLoginLogoutButtons(isLoggedIn) {
            const loginBtn = document.getElementById('openLoginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
        
            if (isLoggedIn) {
                loginBtn.style.display = 'none';
                logoutBtn.style.display = 'flex';
            } else {
                loginBtn.style.display = 'flex';
                logoutBtn.style.display = 'none';
            }
        }
    
        document.getElementById('logoutBtn').addEventListener('click', function () {
            localStorage.removeItem('token'); // Limpia el token
            localStorage.removeItem('ads_removed'); // Limpia el token

            toggleLoginLogoutButtons(false);
            showAlert('Sesión cerrada', 'info');
        });

        function isloggedIn() {
            return !!localStorage.getItem('token');
        }

        
        document.getElementById('removeAdsBtn').addEventListener('click', async function () {
           const wasLoggedIn = isloggedIn(); 

            const success = await quitarAnuncios();a
            if (success) {
                showAlert('Anuncios desactivados correctamente', 'success');
                this.style.display = 'none';

                if (!wasLoggedIn && isloggedIn()) {
                    toggleLoginLogoutButtons(true); // <-- Ahora sí actualizas el botón
                }
            }

        });

    });
}
