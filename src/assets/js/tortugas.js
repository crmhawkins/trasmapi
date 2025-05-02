import { showInterstitialAd } from './ads.js';
import { App } from '@capacitor/app';


export default  function tortugas(){
    document.getElementById("startButton").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';
        document.getElementById('userLoginArea').style.display = 'none';
        document.getElementById('jugarGame1').style.display = 'block';

    });

    document.getElementById("startGameTortugas").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('jugarGame1').style.display = 'none';

        // Iniciar el juego
        startGame();
    
        // Comenzar la música
        let music = document.getElementById("backgroundMusic");
        music.volume = 0.6;
    
        music.play();
        document.getElementById('sea').classList.remove('paused-animation');
    
        // Ocultar la pantalla de inicio
        document.getElementById("startScreen").style.display = "none";
    });

    document.getElementById("startGame1").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);

        document.getElementById('jugarGame1').style.display = 'block';
        document.getElementById('infoGame1').style.display = 'none';

    });
    
    document.getElementById("masInfoTortugas").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame1').style.display = 'block';
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';

    });
    document.getElementById("volverGame1").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame1').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';
        document.getElementById('userLoginArea').style.display = 'block';

    });
    document.getElementById("volverTortugas").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame1').style.display = 'none';
        document.getElementById('jugarGame1').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';
        document.getElementById('userLoginArea').style.display = 'block';

    });
    function startGame() {

        fetch('https://trasmapiback.hawkins.es/api/data/tortugas')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => b.puntuacion - a.puntuacion); // 👈 usa "puntuacion"
                const top = sortedData[0];

                if (top) {
                    document.getElementById("puntosTortugas").textContent = top.puntuacion;
                } else {
                    document.getElementById("puntosTortugas").textContent = 0;
                }
            })
            .catch(error => {
                console.error('Error al obtener record:', error);
        });

        // Aquí iría todo el código de inicialización de tu juego
        // Por ejemplo, la parte de la música, la creación de tortugas, el movimiento del barco, etc.
        const boat = document.getElementById('boat');
        const gameArea = document.getElementById('gameArea');
        const scoreElement = document.getElementById('points');
        let boatPosition = (gameArea.clientHeight / 2) - (boat.clientHeight / 2);
        // boat.style.top = boatPosition + 'px';
        if (boatPosition == 0) {
            boat.style.top = 100 + 'px'; // Asegúrate de que el barco está en la posición inicial
            
        }else{
            boat.style.top = boatPosition + 'px';
        }
        let boatMoving = null;
        let turtleSpeed = 150;
 // velocidad inicial de las tortugas más rápida
        let turtleSpawnRate = 2000; // velocidad inicial de aparición de las tortugas
        let score = 0;
        let paused = false;
        let turtleIntervals = [];
        let cloudIntervals = [];
        let music = document.getElementById("backgroundMusic");
        let turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
        let startTouchY = null;
        const sea = document.getElementById('sea');
        let gameRunning = true;
        let boatPositionLeft = 0; // O cualquier valor inicial.
        let startTouchX = null;
        let boatHorizontalPosition = boat.offsetLeft; // Asumiendo que 'boat' es el elemento que estás moviendo.
        gameArea.style.display='block';
        let boatMoveAmount = 20; // La cantidad de píxeles que quieres que el barco se mueva con cada toque


        //eventos
        document.addEventListener('keydown', function(e) {
            if (e.key === "p" || e.key === "P") {
                paused = !paused;  // Cambiar el estado de pausa
            }
        });

        // if (gameArea.requestFullscreen) {
        //     gameArea.requestFullscreen();
        // } else if (gameArea.webkitRequestFullscreen) { /* Safari */
        //     gameArea.webkitRequestFullscreen();
        // } else if (gameArea.msRequestFullscreen) { /* IE/Edge */
        //     gameArea.msRequestFullscreen();
        // }

        document.addEventListener('keydown', function(e) {
            if (paused) return;
            
            if (boatMoving) return;
            const sea = document.getElementById('sea');
    
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                boatMoving = setInterval(function() {
                    // Mover hacia arriba solo si la parte superior del barco está dentro del área del mar
                    if (e.key === "ArrowUp" && boatPosition > 0) {
                        boatPosition -= 5;
                    }
                    // Mover hacia abajo solo si la parte inferior del barco está dentro del área del mar
                    else if (e.key === "ArrowDown" && boatPosition < sea.clientHeight - boat.clientHeight) {
                        boatPosition += 5;
                    }
                    boat.style.top = boatPosition + 'px';
                }, 25);  
            }

        });
        document.addEventListener('keyup', function() {
            clearInterval(boatMoving);
            boatMoving = null;
        });


        document.getElementById("reiniciarTortugas").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            let music = document.getElementById("backgroundMusic");
            music.volume = 0.6;
        
            music.play();
            resetGameFinal()
        });

        document.getElementById("reiniciarTortugasPrimero").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            let music = document.getElementById("backgroundMusic");
            music.volume = 0.6;
        
            music.play();
            resetGameFinal()
        });

        document.getElementById("botonSalirTortugas").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            clearInterval(turtleSpawner);

            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('sea');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.turtle');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            let music = document.getElementById("backgroundMusic");
            // music.volume = 0.6;

            music.pause();
                        // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 150;

            turtleSpawnRate = 2000;
            // music.volume = 0.6;
            // gameRunning = false;
            // paused = true;
            // score = 0;
            updateScore(0, true); // ✅ reinicia a cero
            document.getElementById('sea').classList.remove('paused-animation');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';
            document.getElementById('userLoginArea').style.display = 'block';

        });

        document.getElementById("salirPantalla").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            clearInterval(turtleSpawner);

            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('sea');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.turtle');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            let music = document.getElementById("backgroundMusic");
            // music.volume = 0.6;

            music.pause();
                        // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 150;

            turtleSpawnRate = 2000;
            // music.volume = 0.6;
            // gameRunning = false;
            // paused = true;
            score = 0;
            updateScore(score);
            document.getElementById('scoreScreen').style.display = 'none';
            document.getElementById('sea').classList.remove('paused-animation');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';
            document.getElementById('userLoginArea').style.display = 'block';


        });
    
        document.getElementById('botonUp').addEventListener('click', function(event) {
            if (paused) return;
        
            // Actualiza boatPosition para reflejar la posición actual del barco antes de moverlo
            boatPosition = boat.offsetTop;
        
            // Si tocas por encima del centro del barco, muévelo hacia arriba
            boatPosition -= boatMoveAmount;
            
            // Restricciones para evitar que el barco salga del área de juego
            if (boatPosition < 0) boatPosition = 0;
            if (boatPosition > sea.clientHeight - boat.clientHeight) boatPosition = sea.clientHeight - boat.clientHeight;
        
            boat.style.top = boatPosition + 'px';
        });

        document.getElementById('botonDown').addEventListener('click', function(event) {
            if (paused) return;
        
            // Actualiza boatPosition para reflejar la posición actual del barco antes de moverlo
            boatPosition = boat.offsetTop;
        
            // Si tocas por encima del centro del barco, muévelo hacia arriba
            boatPosition += boatMoveAmount;
            
            // Restricciones para evitar que el barco salga del área de juego
            if (boatPosition < 0) boatPosition = 0;
            if (boatPosition > sea.clientHeight - boat.clientHeight) boatPosition = sea.clientHeight - boat.clientHeight;
        
            boat.style.top = boatPosition + 'px';
        }); 
    
        // Verifica la orientación al cargar la página
        window.addEventListener('load', checkOrientation, false);
    
        // Verifica la orientación cuando el tamaño de la ventana cambia (por ejemplo, cuando el dispositivo rota)
        window.addEventListener('resize', checkOrientation, false);
        
        function updateScore(points = 0, reset = false) {
            if (reset) {
                score = 0;
            } else {
                score += points;
            }
            scoreElement.textContent = score;
        }
        

        // Resetear juego
        function resetGame() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('sea');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.turtle');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
                        // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 150;

            turtleSpawnRate = 2000;
            music.volume = 0.6;

            score = 0;
            updateScore(score);

            document.getElementById('sea').classList.remove('paused-animation');
    
        }

        function resetGameFinal() {

            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            
            // Si ya existe un intervalo para el spawner de tortugas, detenerlo.
            if (turtleSpawner) {
                clearInterval(turtleSpawner);
            }
        
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('sea');
            
            // Eliminar todas las tortugas del área de juego.
            const turtles = document.querySelectorAll('.turtle');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            
            // Resetea la posición del barco y otras variables del juego.
            paused = false;
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 150;

            turtleSpawnRate = 2000;
            music.volume = 0.6;
            // score = 0;
            // updateScore(score);
            updateScore(0, true); // ✅ reinicia a cero

            document.getElementById('playerNameTortuga').value = '';
            document.getElementById("scoreScreen").style.display = "none";
            document.getElementById("scoreDatos").style.display = 'block';
            document.getElementById("scoreLista").style.display = 'none';
            document.getElementById('sea').classList.remove('paused-animation');
            // Luego inicializa el movimiento de las nubes.
            moveCloud(document.getElementById('cloud1'), 50);  
            moveCloud(document.getElementById('cloud2'), 60); 
            moveCloud(document.getElementById('cloud3'), 70);
        
            // Establecer el spawner de tortugas después de resetear las variables.
            turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
        }

        document.getElementById("resumeButtonTortuga").addEventListener("click", function(){
            const gameAreass = document.getElementById('bodyArea');
            
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
            // if (!isSafari) {
            //     if (gameAreass.requestFullscreen) {
            //         gameAreass.requestFullscreen();
            //     } else if (gameAreass.webkitRequestFullscreen) { /* Safari */
            //         gameAreass.webkitRequestFullscreen();
            //     } else if (gameAreass.msRequestFullscreen) { /* IE/Edge */
            //         gameAreass.msRequestFullscreen();
            //     }
            // }
            console.log('Seguir Juego Posidonias')

            let music = document.getElementById("backgroundMusic");
            music.volume = 0.6;
        
            music.play();
            document.getElementById('pauseModalTortuga').style.display = 'none';
            turtlesData.forEach(turtleData => {
                const interval = setInterval(function() {
                    turtleData.position -= 12;
                    turtleData.element.style.left = turtleData.position + 'px';
        
                    // Aquí, coloca el código que ya tienes que maneja la colisión, la puntuación y la eliminación de tortugas fuera de la pantalla...
        
                }, turtleData.speed);
        
                turtleIntervals.push(interval);
            });
            paused = !paused;  // Cambiar el estado de pausa

        });

        document.getElementById("botonPausarTortuga").addEventListener("click", function(){
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            document.getElementById('pauseModalTortuga').style.display = 'block';
            turtleIntervals.forEach(interval => {
                clearInterval(interval);
            });
            paused = !paused;  // Cambiar el estado de pausa
            let music = document.getElementById("backgroundMusic");    
                music.pause();
        });

        let turtlesData = []; // Para almacenar información sobre las tortugas en movimiento

        function createTurtle() {
            if (paused) return;
    
            const sea = document.getElementById('sea'); 
            const turtleCount = turtlesData.length; // Obtén la cantidad actual de tortugas
            // Verifica si hay más de 20 tortugas y ajusta turtleSpawnRate
            if (turtleCount > 3) {
                turtleSpawnRate = 2500; // Reduzca turtleSpawnRate como desees
            }

            const turtle = document.createElement('div');
            turtle.classList.add('object', 'turtle');
            
            // Ajustar la posición vertical de la tortuga para que coincida con la posición del barco
            turtle.style.top = boat.offsetTop + 'px';
            sea.appendChild(turtle); 

            const turtleData = {
                element: turtle,
                speed: turtleSpeed,
                position: turtle.offsetLeft
            };
            const turtleInterval = setInterval(function() {
                turtle.style.left = (turtle.offsetLeft - 12) + 'px'; 
                turtleData.position = turtle.offsetLeft;
                
                // Si la tortuga sale de la pantalla, elimínala y actualiza la puntuación
                if (turtle.offsetLeft + turtle.clientWidth <= 0) {
                    // Reproducir el sonido de tortuga salvada
                    let savedSound = document.getElementById("savedSound");
                    savedSound.play();
    
                    if (sea.contains(turtle)) {
                        sea.removeChild(turtle);
                    }
                    clearInterval(turtleInterval);
                    updateScore(5); 
    
                    turtleSpeed *= 0.96; 
                    turtleSpawnRate *= 0.96; 
                }
    
                const overlapMarginHorizontal = 20; // Aumenta este valor al margen horizontal deseado
                const overlapMarginVertical = 2;
                let music = document.getElementById("backgroundMusic");
    
                let crashSound = document.getElementById("crashSound");
                //let gameRunning = true;
    
                if (turtle.offsetLeft < boat.offsetLeft + boat.offsetWidth - overlapMarginHorizontal &&
                    turtle.offsetLeft + turtle.offsetWidth > boat.offsetLeft + overlapMarginHorizontal &&
                    turtle.offsetTop + turtle.offsetHeight > boat.offsetTop + overlapMarginVertical &&
                    turtle.offsetTop < boat.offsetTop + boat.offsetHeight - overlapMarginVertical) {
                    
                    if (sea.contains(turtle)) {
                        sea.removeChild(turtle);
                    }
                    gameRunning = false;
    
                    crashSound.play();
    
                    paused = true;
                    music.volume = 0.3;  // Reducir el volumen al 50%
                    music.pause();
                    turtleIntervals.forEach(clearInterval);  
                    cloudIntervals.forEach(clearInterval);  // Limpiar todos los intervalos de las nubes
                    clearInterval(boatMoving);  
                    clearInterval(turtleSpawner);  
                    document.getElementById('sea').classList.add('paused-animation');
    
                    showInterstitialAd().then(() => {
                        showScoreScreen(score);
                    });                            // alert('¡El barco ha chocado con una tortuga!');
                    //resetGame();
                }
    
            }, turtleSpeed);
            turtlesData.push(turtleData);
            turtleIntervals.push(turtleInterval);
            // console.log(turtleSpeed)
            // console.log(turtleSpawner)
        }
    
        function moveCloud(cloudElement, duration) {
            const sky = document.getElementById('sky');
            const maxTopPosition = sky.clientHeight - cloudElement.clientHeight - 10; 
    
            const speed = 0.5 * (100 / duration); // Esto nos dará una velocidad que depende de la duración. Si quieres que las nubes se muevan más rápido, puedes ajustar el valor 0.5.
    
            const cloudMovement = setInterval(() => {
                // Mueve la nube hacia la izquierda de forma fluida
                cloudElement.style.left = (cloudElement.offsetLeft - speed) + 'px';
    
                // Si la nube sale completamente del área del cielo, restablece su posición
                if (cloudElement.offsetLeft + cloudElement.clientWidth <= 0) {
                    cloudElement.style.left = sky.clientWidth + 'px';
                    cloudElement.style.top = Math.random() * maxTopPosition + 'px'; 
                    cloudElement.style.width = (80 + Math.random() * 40) + 'px';
                    cloudElement.style.height = (50 + Math.random() * 30) + 'px'; 
                }
            }, 30);  // Intervalo fijo de 30ms para un movimiento fluido
            cloudIntervals.push(cloudMovement);
        }
    
        function setInitialCloudPosition(cloudElement) {
            const sky = document.getElementById('sky');
            const maxTopPosition = sky.clientHeight - cloudElement.clientHeight;
            cloudElement.style.top = Math.random() * maxTopPosition + 'px';
        }
        function checkOrientation() {
            const rotateDeviceElement = document.getElementById('rotateDevice');
    
            if (window.innerWidth < window.innerHeight) { // Modo retrato
                rotateDeviceElement.style.display = 'flex';
            } else { // Modo paisaje
                rotateDeviceElement.style.display = 'none';
            }
        }
    
        function showScoreScreen(score) {
            console.log('entro');
            document.getElementById("finalScore").textContent = score;
            document.getElementById("scoreScreen").style.display = "block";
            // Puedes cargar las puntuaciones aquí también:
            displayTopScores();
        }
        document.getElementById("saveScore").addEventListener("click", function() {
            const playerName = document.getElementById('playerNameTortuga').value;
            // const score = 100;  // Cambia esto por la puntuación deseada

            fetch('https://trasmapiback.hawkins.es/api/save/tortugas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `playerName=${playerName}&score=${score}`,
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);  // Debería imprimir "Datos guardados."
                
                fetch('https://trasmapiback.hawkins.es/api/data/tortugas')
                    .then(response => response.json())
                    .then(data => {
                        // Ordenar el array por puntuación de forma descendente
                        const sortedData = data.sort((a, b) => b.puntuacion - a.puntuacion);
                        
                        // Tomar las primeras 10 puntuaciones
                        const top10 = sortedData.slice(0, 10);
                        document.getElementById("scoreDatos").style.display = 'none';
                        document.getElementById("scoreLista").style.display = 'block';
                        displayScores(top10);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

        function saveScore() {
            let playerName = document.getElementById("playerNameTortuga").value;
            let score = parseInt(document.getElementById("finalScore").textContent);
    
            // Obtener las puntuaciones guardadas (o un array vacío si no hay ninguna)
            let scores = JSON.parse(localStorage.getItem("scores")) || [];
    
            // Añadir la nueva puntuación
            scores.push({ name: playerName, score: score });
    
            // Ordenar las puntuaciones y guardar las primeras 10
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 10);
    
            // Guardar de nuevo en localStorage
            localStorage.setItem("scores", JSON.stringify(scores));
    
            // Mostrar las puntuaciones actualizadas
            displayTopScores();
        }

        function displayScores(scores) {
            const tableBody  = document.getElementById('tbodyTortugas');
        
           // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
            tableBody.innerHTML = '';

            scores.forEach(score => {
                const row = tableBody.insertRow();

                const playerNameCell = row.insertCell(0);
                playerNameCell.textContent = score.nombre;
                playerNameCell.classList.add('playerName');  // Añadir clase a la celda del nombre

                const scoreCell = row.insertCell(1);
                scoreCell.textContent = score.puntuacion;
                scoreCell.classList.add('scorePoints');  // Añadir clase a la celda de puntuación

            });
        }

        function displayTopScores() {
            let scores = JSON.parse(localStorage.getItem("scores")) || [];
            let list = document.getElementById("topScores");
            list.innerHTML = ""; // Limpiar la lista actual
    
            scores.forEach(score => {
                let li = document.createElement("li");
                li.textContent = score.name + ": " + score.score;
                list.appendChild(li);
            });
        }
        // Establecer la posición inicial de las nubes:
        setInitialCloudPosition(document.getElementById('cloud1'));
        setInitialCloudPosition(document.getElementById('cloud2'));
        setInitialCloudPosition(document.getElementById('cloud3'));
    
        // Luego inicializa el movimiento de las nubes.
        moveCloud(document.getElementById('cloud1'), 50);  
        moveCloud(document.getElementById('cloud2'), 60); 
        moveCloud(document.getElementById('cloud3'), 70);

        App.addListener('appStateChange', ({ isActive }) => {
            if(document.getElementById("startScreen").style.display == "none"){
                if( document.getElementById('jugarGame1').style.display == 'block'){

                    if (!isActive) {
                        console.log('App en segundo plano, pausando juego...');
                        
                        // Pausar música
                        music.pause();
                
                        // Pausar el juego
                        paused = true;
                
                        // Mostrar el modal de pausa si lo deseas
                        document.getElementById('pauseModalTortuga').style.display = 'block';
                
                        // Detener tortugas
                        turtleIntervals.forEach(clearInterval);
                    }  else {
                        console.log('App activa de nuevo');
                
                        // Solo si no está en pausa manual por el usuario
                        if (!paused) {
                            music.play().catch(err => console.warn('Error al reanudar música', err));
                            // Aquí podrías reanudar las tortugas si lo deseas automáticamente
                        }
                    }
                }
            }

        });
    }

}