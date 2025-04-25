import tortugas  from './assets/js/tortugas.js';
import posidonias  from './assets/js/posidonias.js';
import limpieza  from './assets/js/limpieza.js';
import './assets/css/app.css';
//import { register, login, loginWithGoogle } from './assets/js/auth.js';



window.addEventListener('load', function () {
    window.scrollTo({ top: 1, behavior: 'smooth' });

    console.log('Iniciando el Juego... by Hawkins')
    const loader = document.querySelector(".intro_loader");
    const content = document.querySelector(".intro_content");

    setTimeout(() => {
        loader.style.display = "none";
        content.classList.remove("oculto");
    }, 1000);

    document.addEventListener('dblclick', function(event) {
        event.preventDefault();
    }, { passive: false });

    tortugas();
    posidonias();
    limpieza();

    document.getElementById("addToHomeBtn").addEventListener("click", function() {
        setTimeout(function() {
            window.scrollTo(0, 1);
        }, 0);

        const gameAreass = document.getElementById('bodyArea');
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (!isSafari) {
            if (gameAreass.requestFullscreen) {
                gameAreass.requestFullscreen();
            } else if (gameAreass.webkitRequestFullscreen) {
                gameAreass.webkitRequestFullscreen();
            } else if (gameAreass.msRequestFullscreen) {
                gameAreass.msRequestFullscreen();
            }
        }

        document.getElementById("introScreen").style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });

    // window.register = register;
    // window.login = login;
    // window.loginWithGoogle = loginWithGoogle;
    
});
