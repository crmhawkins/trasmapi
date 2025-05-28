export async function showInterstitialAd() {
    if (localStorage.getItem('ads_removed') === 'true' || localStorage.getItem('ads_removed') === '1') {
        console.log('🚫 Usuario ha pagado, no mostramos anuncio.');
        return;
    }

    try {
        const response = await fetch('https://trasmapiback.hawkins.es/api/anuncio');
        const anuncio = await response.json();

        const modal = document.getElementById('customAdModal');
        const mediaContainer = document.getElementById('adMedia');
        const title = document.getElementById('adTitle');
        const text = document.getElementById('adText');
        const verMasBtn = document.getElementById('adMoreBtn');
        const closeBtn = document.getElementById('closeAdBtn');

        if (!modal || !mediaContainer || !verMasBtn || !closeBtn) return;

        // Resetear estado
        mediaContainer.innerHTML = '';
        title.textContent = anuncio.titulo || '¡Anuncio!';
        text.textContent = anuncio.texto || '';
        modal.style.display = 'flex';

        // Ocultar botón de cerrar inicialmente
        closeBtn.style.pointerEvents = 'none';
        closeBtn.style.opacity = '0.5';
        closeBtn.disabled = true;
        closeBtn.style.cursor = 'not-allowed';

        // Insertar media
        if (anuncio.tipo === 'imagen') {
            const img = document.createElement('img');
            img.src = anuncio.media;
            img.style.width = '100vw';
            img.style.height = '100vh';
            img.style.objectFit = 'cover';
            mediaContainer.appendChild(img);

            // Mostrar botón tras 5 segundos (imagen)
            setTimeout(() => {
                closeBtn.style.pointerEvents = 'auto';
                closeBtn.style.opacity = '1';
                closeBtn.disabled = false;
                closeBtn.style.cursor = 'pointer';
            }, 5000);

        } else if (anuncio.tipo === 'video') {
            const video = document.createElement('video');
            video.src = anuncio.media;
            video.style.width = '100vw';
            video.style.height = '100vh';
            video.style.objectFit = 'cover';
            video.autoplay = true;
            video.muted = false;
            video.playsInline = true;
            video.controls = false;
            mediaContainer.appendChild(video);

            // Esperar a que el video termine
            video.addEventListener('ended', () => {
                closeBtn.style.pointerEvents = 'auto';
                closeBtn.style.opacity = '1';
                closeBtn.disabled = false;
                closeBtn.style.cursor = 'pointer';
            });
        }

        // Acción botón "Ver más"
        verMasBtn.onclick = () => window.open(anuncio.link, '_blank');

        // Acción botón cerrar
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            mediaContainer.innerHTML = ''; // limpieza
        };

    } catch (error) {
        console.error('❌ Error al cargar el anuncio:', error);
    }
}
