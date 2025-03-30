export default  function posidonias(){
    document.getElementById("startPosidonias").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';
        document.getElementById('jugarGame2').style.display = 'block';
    });

    document.getElementById("startGamePosidonias").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('jugarGame2').style.display = 'none';

        // Iniciar el juego
        startGame();
    
        // Comenzar la música
        let music = document.getElementById("backgroundMusic");
        music.volume = 0.6;
    
        music.play();
        document.getElementById('seaPosidonia').classList.remove('paused-animationPosidonias');
    
        // Ocultar la pantalla de inicio
        document.getElementById("startScreen").style.display = "none";
    });
    document.getElementById("startGame2").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);

        document.getElementById('jugarGame2').style.display = 'block';
        document.getElementById('infoGame2').style.display = 'none';

    });

    document.getElementById("masInfoPosidonias").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame2').style.display = 'block';
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';

    });
    document.getElementById("volverPosidonias").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame2').style.display = 'none';
        document.getElementById('jugarGame2').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';

    });

    document.getElementById("volverGame2").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame2').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';

    });
    
    function startGame() {
        fetch('https://trasmapiback.hawkins.es/api/data/posidonias')
        .then(response => response.json())
        .then(data => {
            // Ordenar por puntuación descendente
            const sortedData = data.sort((a, b) => b.puntuacion - a.puntuacion);

            // Tomar la puntuación más alta
            const top = sortedData.slice(0, 1);

            console.log(top[0].puntuacion);

            document.getElementById("puntosPosidonias").textContent = top[0].puntuacion;

            console.log(top);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        // Aquí iría todo el código de inicialización de tu juego
        // Por ejemplo, la parte de la música, la creación de tortugas, el movimiento del barco, etc.
        const boat = document.getElementById('boatPosidonia');
        const gameArea = document.getElementById('gameAreaPosidonias');
        const scoreElement = document.getElementById('pointsPosidonias');
        const sea = document.getElementById('seaPosidonia');
        let boatPosition = (gameArea.clientHeight / 2) - (boat.clientHeight / 2);
        //boat.style.top = 50 + '%';
        // boat.style.top = '100px';
        if (boatPosition == 0) {
            boat.style.top = 200 + 'px'; // Asegúrate de que el barco está en la posición inicial
            
        }else{
            boat.style.top = boatPosition + 'px';
        }

        
        let boatMoving = null;
        let turtleSpeed = 120; // velocidad inicial de las tortugas más rápida
        let turtleSpawnRate = 2500; // velocidad inicial de aparición de las tortugas
        let score = 0;
        let paused = false;
        let turtleIntervals = [];
        let cloudIntervals = [];
        let boatMoveAmount = 20; // La cantidad de píxeles que quieres que el barco se mueva con cada toque

        let music = document.getElementById("backgroundMusic");
        let turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
        let startTouchY = 0;
        let gameRunning = true;
        // let boatPositionLeft = 0; // O cualquier valor inicial.
        // let startTouchX = null;
        // let boatHorizontalPosition = boat.offsetLeft; // Asumiendo que 'boat' es el elemento que estás moviendo.
        gameArea.style.display='block'
        // Verificar la orientación cuando se carga la página
        window.onload = checkOrientation;

        // Verificar la orientación cuando se cambia el tamaño de la ventana
        window.onresize = checkOrientation;
        // Comenzar la música
        //music.play();
    
        //eventos
        document.addEventListener('keydown', function(e) {
            if (e.key === "p" || e.key === "P") {
                paused = !paused;  // Cambiar el estado de pausa
            }
        });
    
        if (gameArea.requestFullscreen) {
            gameArea.requestFullscreen();
        } else if (gameArea.webkitRequestFullscreen) { /* Safari */
            gameArea.webkitRequestFullscreen();
        } else if (gameArea.msRequestFullscreen) { /* IE/Edge */
            gameArea.msRequestFullscreen();
        }
        
        document.addEventListener('keydown', function(e) {
            if (paused) return;
            
            if (boatMoving) return;
            const sea = document.getElementById('seaPosidonia');
    
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
            /*
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                boatMoving = setInterval(function() {
                    // Mover hacia la izquierda solo si la parte izquierda del barco está dentro del área del mar
                    if (e.key === "ArrowLeft" && boatPositionLeft > 0) {
                        boatPositionLeft -= 5;
                    }
                    // Mover hacia la derecha solo si la parte derecha del barco está dentro del área del mar
                    else if (e.key === "ArrowRight" && boatPositionLeft < sea.clientWidth - boat.clientWidth) {
                        boatPositionLeft += 5;
                    }
                    boat.style.left = boatPositionLeft + 'px';
                }, 25);  
            }*/
        });
        document.addEventListener('keyup', function() {
            clearInterval(boatMoving);
            boatMoving = null;
        });
        // document.getElementById("botonVolverPosidonias").addEventListener("click", function() {
        //     setTimeout(function() {
        //         // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
        //         window.scrollTo(0, 1);
        //     }, 0);
        //     resetGame()
        // }); 
        document.getElementById("reiniciarPosidonias").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            resetGameFinal()
        });
        document.getElementById("reiniciarPosidoniasPrimero").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            resetGameFinal()
        });
        document.getElementById("botonSalirPosidonias").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];

            clearInterval(turtleSpawner);

            
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaPosidonia');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.posidonia');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            let music = document.getElementById("backgroundMusic");
            // music.volume = 0.6;

            music.pause();   // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 80;
            turtleSpawnRate = 2000;
            // music.volume = 0.6;
            score = 0;
            updateScore(score);

            document.getElementById('seaPosidonia').classList.remove('paused-animationPosidonias');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';

        });
        document.getElementById("salirPantallaPosidonias").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];

            clearInterval(turtleSpawner);

            
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaPosidonia');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.posidonia');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            let music = document.getElementById("backgroundMusic");
            // music.volume = 0.6;

            music.pause();   // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 80;
            turtleSpawnRate = 2000;
            // music.volume = 0.6;
            score = 0;
            updateScore(score);
            document.getElementById('scoreScreenPosidonias').style.display = 'none';

            document.getElementById('seaPosidonia').classList.remove('paused-animationPosidonias');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';

        });
        document.getElementById('botonUpPosidonia').addEventListener('click', function(event) {
            if (paused) return;
        
            // let touchY = event.touches[0].clientY;
        
            // Calcula la posición vertical del sea en relación con gameArea
            // let seaPosition = sea.getBoundingClientRect().top;
        
            // Ajusta la coordenada Y táctil restando la posición del sea en gameArea
            // touchY -= seaPosition;
        
            // Actualiza boatPosition para reflejar la posición actual del barco antes de moverlo
            boatPosition = boat.offsetTop;
        
            // Si tocas por encima del centro del barco, muévelo hacia arriba
            boatPosition -= boatMoveAmount;
            
            // Restricciones para evitar que el barco salga del área de juego
            if (boatPosition < 0) boatPosition = 0;
            if (boatPosition > sea.clientHeight - boat.clientHeight) boatPosition = sea.clientHeight - boat.clientHeight;
        
            boat.style.top = boatPosition + 'px';
        });

        document.getElementById('botonDownPosidonia').addEventListener('click', function(event) {
            if (paused) return;
        
            // let touchY = event.touches[0].clientY;
        
            // Calcula la posición vertical del sea en relación con gameArea
            // let seaPosition = sea.getBoundingClientRect().top;
        
            // Ajusta la coordenada Y táctil restando la posición del sea en gameArea
            // touchY -= seaPosition;
        
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
            document.body.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, { passive: false });
    
       
    
        // Actualizar marcador
        function updateScore(points) {
            score += points;
            scoreElement.textContent = score;
        }
        // Resetear juego
        function resetGame() {
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaPosidonia');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.posidonia');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
                        // Resetea la posición del barco y otras variables del juego.
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 80;
            turtleSpawnRate = 2000;
            music.volume = 0.6;
            score = 0;
            updateScore(score);

            document.getElementById('seaPosidonia').classList.remove('paused-animationPosidonias');
    
        }

        function resetGameFinal() {
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            
            // Si ya existe un intervalo para el spawner de tortugas, detenerlo.
            if (turtleSpawner) {
                clearInterval(turtleSpawner);
            }
        
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaPosidonia');
            
            // Eliminar todas las tortugas del área de juego.
            const turtles = document.querySelectorAll('.posidonia');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            
            // Resetea la posición del barco y otras variables del juego.
            paused = false;
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 120;
            turtleSpawnRate = 2500;
            music.volume = 0.6;
            score = 0;
            updateScore(score);
            document.getElementById('playerNamePosidonias').value = '';
            document.getElementById("scoreScreenPosidonias").style.display = "none";
            document.getElementById("scoreDatosPosidonias").style.display = 'block';
            document.getElementById("scoreListaPosidonias").style.display = 'none';
            document.getElementById('seaPosidonia').classList.remove('paused-animationPosidonias');
            moveCloud(document.getElementById('cloudPosidonia1'), 50);  
            moveCloud(document.getElementById('cloudPosidonia2'), 60); 
            moveCloud(document.getElementById('cloudPosidonia3'), 70);
            // Establecer el spawner de tortugas después de resetear las variables.
            turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
        }

        document.getElementById("resumeButtonPosidonia").addEventListener("click", function(){
            const gameAreass = document.getElementById('bodyArea');
            
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
            console.log('Seguir Juego Posidonias')

                document.getElementById('pauseModalPosidonia').style.display = 'none';

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
        document.getElementById("botonPausarPosidonias").addEventListener("click", function(){
            console.log('Pausar Juego Posidonias')
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
                document.getElementById('pauseModalPosidonia').style.display = 'block';
                turtleIntervals.forEach(interval => {
                    clearInterval(interval);
                });
                paused = !paused;  // Cambiar el estado de pausa
        });
        function togglePause() {
            paused = !paused;
        
            const sea = document.getElementById('seaPosidonia');
        
            if (paused) {
                sea.classList.add('paused-animationPosidonias');
        
                // Pausa el spawner de tortugas
                timers.push(turtleSpawner);
                
                // Aquí puedes agregar cualquier otro intervalo o timeout que estés utilizando
                // timers.push(otroIntervalo);
                // timers.push(otroTimeout);
        
                // Limpiamos todos los intervalos y timeouts
                timers.forEach(timer => clearInterval(timer));
                
                document.getElementById('pauseModal').style.display = 'block';
            } else {
                sea.classList.remove('paused-animationPosidonias');
                
                // Reanudamos el spawner de tortugas
                turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
                
                // Si tenías otros intervalos o timeouts, también deberías reanudarlos aquí.
                // otroIntervalo = setInterval(funcionDeEseIntervalo, tiempo);
                // otroTimeout = setTimeout(funcionDeEseTimeout, tiempo);
                
                document.getElementById('pauseModal').style.display = 'none';
            }
        }
        
        
        let turtlesData = []; // Para almacenar información sobre las tortugas en movimiento

        function createTurtle() {
            if (paused) return;
    
            const sea = document.getElementById('seaPosidonia'); 
            const turtle = document.createElement('div');
            turtle.classList.add('objectPosidonia', 'posidonia');

            // Ajustar la posición vertical de la tortuga para que coincida con la posición del barco
            turtle.style.top = boat.offsetTop + 'px';
            
            sea.appendChild(turtle); 
            const turtleData = {
                element: turtle,
                speed: turtleSpeed,
                position: turtle.offsetLeft
            };
            const overlapMargin = 1;  // Este valor determina cuánto deben superponerse el barco y la tortuga antes de que se detecte una colisión
            const frontalOverlap = 30; // Este valor determina el ancho de la zona frontal del barco para detectar colisiones frontales
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
    
                

                let music = document.getElementById("backgroundMusic");
    
                let crashSound = document.getElementById("crashSound");
                //let gameRunning = true;
               

                if (turtle.offsetLeft < boat.offsetLeft + boat.offsetWidth - overlapMargin &&
                    turtle.offsetLeft + turtle.offsetWidth > boat.offsetLeft + overlapMargin &&
                    turtle.offsetTop + turtle.offsetHeight > boat.offsetTop + overlapMargin &&
                    turtle.offsetTop < boat.offsetTop + boat.offsetHeight - overlapMargin
                ) {
                    if (turtle.offsetLeft + turtle.offsetWidth >= boat.offsetLeft + boat.offsetWidth - frontalOverlap) {
                        // Colisión frontal
                    
                        if (sea.contains(turtle)) {
                            //showScoreScreen(score);
                            sea.removeChild(turtle);
                        }
                        gameRunning = false;
        
                        crashSound.play();
        
                        paused = true;
                        music.volume = 0.3;  // Reducir el volumen al 50%
        
                        turtleIntervals.forEach(clearInterval);  
                        cloudIntervals.forEach(clearInterval);  // Limpiar todos los intervalos de las nubes
                        clearInterval(boatMoving);  
                        clearInterval(turtleSpawner);  
                        document.getElementById('seaPosidonia').classList.add('paused-animationPosidonias');
        
                        showScoreScreen(score);
                                // alert('¡El barco ha chocado con una tortuga!');
                        //resetGame();
                    }
                }
    
            }, turtleSpeed);
            turtlesData.push(turtleData);
            turtleIntervals.push(turtleInterval);
        }
    
        function moveCloud(cloudElement, duration) {
            const sky = document.getElementById('skyPosidonias');
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
            const sky = document.getElementById('skyPosidonias');
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
            document.getElementById("finalScorePosidonias").textContent = score;
            document.getElementById("scoreScreenPosidonias").style.display = "block";
            // Puedes cargar las puntuaciones aquí también:
            displayTopScores();
        }

        document.getElementById("saveScorePosidonias").addEventListener("click", function() {
            const playerName = document.getElementById('playerNamePosidonias').value;
            // const score = 100;  // Cambia esto por la puntuación deseada

            fetch('https://trasmapiback.hawkins.es/api/save/posidonias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `playerName=${playerName}&score=${score}`,
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);  // Debería imprimir "Datos guardados."
                
                fetch('https://trasmapiback.hawkins.es/api/data/posidonias')
                    .then(response => response.json())
                    .then(data => {
                        // Ordenar el array por puntuación de forma descendente
                        const sortedData = data.sort((a, b) => b.score - a.score);
                        
                        // Tomar las primeras 10 puntuaciones
                        const top10 = sortedData.slice(0, 10);
                        document.getElementById("scoreDatosPosidonias").style.display = 'none';
                        document.getElementById("scoreListaPosidonias").style.display = 'block';
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

        function displayScores(scores) {
            const tableBody  = document.getElementById('tbodyPosidonias');
        
           // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
            tableBody.innerHTML = '';

            scores.forEach(score => {
                const row = tableBody.insertRow();

                const playerNameCell = row.insertCell(0);
                playerNameCell.textContent = score.playerName;
                playerNameCell.classList.add('playerName');  // Añadir clase a la celda del nombre

                const scoreCell = row.insertCell(1);
                scoreCell.textContent = score.score;
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
    
        // iniciar

        // Establecer la posición inicial de las nubes:
        setInitialCloudPosition(document.getElementById('cloudPosidonia1'));
        setInitialCloudPosition(document.getElementById('cloudPosidonia2'));
        setInitialCloudPosition(document.getElementById('cloudPosidonia3'));
    
        // Luego inicializa el movimiento de las nubes.
        moveCloud(document.getElementById('cloudPosidonia1'), 50);  
        moveCloud(document.getElementById('cloudPosidonia2'), 60); 
        moveCloud(document.getElementById('cloudPosidonia3'), 70);
    }
}