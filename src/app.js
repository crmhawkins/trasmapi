import tortugas  from './assets/js/tortugas.js'
import posidonias  from './assets/js/posidonias.js'
import limpieza  from './assets/js/limpieza.js'
import './assets/css/app.css';

window.addEventListener('load', function () {
    window.scrollTo({ top: 1, behavior: 'smooth' });

    console.log('Iniciando el Juego... by Hawkins')
    const loader = document.querySelector(".intro_loader");
    const content = document.querySelector(".intro_content");
    
    // Mostrar contenido animado tras la pantalla oscura
    setTimeout(() => {
        loader.style.display = "none";
        content.classList.remove("oculto");
    }, 1000); // mismo delay que `animation-delay`


    document.addEventListener('dblclick', function(event) {
        event.preventDefault();
    }, { passive: false });
    tortugas()
    posidonias()
    limpieza()
    

    document.getElementById("addToHomeBtn").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
    
        const gameAreass = document.getElementById('bodyArea');
        
        // Detecta si el navegador es Safari.
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
        if (!isSafari) {
            if (gameAreass.requestFullscreen) {
                gameAreass.requestFullscreen();
            } else if (gameAreass.webkitRequestFullscreen) { /* Safari */
                gameAreass.webkitRequestFullscreen();
            } else if (gameAreass.msRequestFullscreen) { /* IE/Edge */
                gameAreass.msRequestFullscreen();
            }
        }
    
        document.getElementById("introScreen").style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    
    

    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('./assets/js/sw.js').then((registration) => {
    //       console.log('Service Worker registrado con éxito:', registration);
    //     }).catch((error) => {
    //       console.log('Error al registrar el Service Worker:', error);
    //     });
    //   }

    //   let deferredPrompt;

    //   window.addEventListener('beforeinstallprompt', (e) => {
    //     e.preventDefault();
    //     deferredPrompt = e;
      
    //     const btn = document.getElementById('addToHomeBtn');
    //     btn.style.display = 'block';
      
    //     btn.addEventListener('click', () => {
    //       btn.style.display = 'none';
    //       deferredPrompt.prompt();
      
    //       deferredPrompt.userChoice.then((choiceResult) => {
    //         if (choiceResult.outcome === 'accepted') {
    //             console.log('Usuario aceptó la instalación');
    //         } else {
    //           console.log('Usuario rechazó la instalación');
    //         }
    //         deferredPrompt = null;
    //       });
    //     });
    //   });
    // let deferredPrompt;
    // const someButton = document.getElementById('add-to-home');

    // window.addEventListener('beforeinstallprompt', (e) => {
    // // Evita que Chrome muestre el mini-infobar
    // e.preventDefault();
    // // Guarda el evento para usarlo más tarde.
    // deferredPrompt = e;
    // // Aquí puedes mostrar tu modal o notificación personalizada
    // // ...
    // showInstallButton(); 

    // });

    // function showInstallButton() {
    //     // Supongamos que tienes un botón en tu HTML con el ID 'installButton'
    //     const installButton = document.getElementById('installButton');
    //     installButton.style.display = 'block';
      
    //     installButton.addEventListener('click', (e) => {
    //       deferredPrompt.prompt();
    //       deferredPrompt.userChoice.then((choiceResult) => {
    //         if (choiceResult.outcome === 'accepted') {
    //           console.log('Usuario aceptó la instalación');
    //         } else {
    //           console.log('Usuario rechazó la instalación');
    //         }
    //         deferredPrompt = null;
    //       });
    //     });
    //   }

   
   
    
});
