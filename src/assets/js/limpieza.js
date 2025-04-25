export default  function limpieza(){
    document.getElementById("startLimpieza").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';
        document.getElementById('jugarGame3').style.display = 'block';
    });
    document.getElementById("startGameLimpieza").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('jugarGame3').style.display = 'none';
        // Iniciar el juego
        startGame();
            
        // Comenzar la música
        let music = document.getElementById("backgroundMusic");
        music.volume = 0.6;

        music.play();
        document.getElementById('seaLimpieza').classList.remove('paused-animationLimpieza');

        // Ocultar la pantalla de inicio
        document.getElementById("startScreen").style.display = "none";
    });
    document.getElementById("startGame3").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);

        document.getElementById('jugarGame3').style.display = 'block';
        document.getElementById('infoGame3').style.display = 'none';

    });
    document.getElementById("masInfoLimpieza").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame3').style.display = 'block';
        document.getElementById('game1').style.display = 'none';
        document.getElementById('game2').style.display = 'none';
        document.getElementById('game3').style.display = 'none';

    });
    document.getElementById("volverGame3").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame3').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';

    });
    document.getElementById("volverLimpieza").addEventListener("click", function() {
        setTimeout(function() {
            // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
            window.scrollTo(0, 1);
        }, 0);
        document.getElementById('infoGame3').style.display = 'none';
        document.getElementById('jugarGame3').style.display = 'none';
        document.getElementById('game1').style.display = 'block';
        document.getElementById('game2').style.display = 'block';
        document.getElementById('game3').style.display = 'block';

    });
    

        function startGame() {
            fetch('https://trasmapiback.hawkins.es/api/data/limpieza')
        .then(response => response.json())
        .then(data => {
            // Ordenar por puntuación descendente
            const sortedData = data.sort((a, b) => b.puntuacion - a.puntuacion);
            const top = sortedData[0];

            // Tomar la puntuación más alta
            // const top = sortedData.slice(0, 1);
            if (top) {
                document.getElementById("puntosLimpieza").textContent = top.puntuacion;
            } else {
                document.getElementById("puntosLimpieza").textContent = 0;
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Aquí iría todo el código de inicialización de tu juego
        // Por ejemplo, la parte de la música, la creación de tortugas, el movimiento del barco, etc.
        const boat = document.getElementById('boatLimpieza');
        const gameArea = document.getElementById('gameAreaLimpieza');
        const scoreElement = document.getElementById('pointsLimpieza');
        const sea = document.getElementById('seaLimpieza');
        let boatPosition = (gameArea.clientHeight / 2) - (boat.clientHeight / 2);
        //boat.style.top = '50%';
        // if (boatPosition == 0) {
        //     boat.style.top = 200 + 'px'; // Asegúrate de que el barco está en la posición inicial
            
        // }else{
        //     boat.style.top = boatPosition + 'px';
        // }

        let boatMoving = null;
        let turtleSpeed = 60; // velocidad inicial de las tortugas más rápida
        let turtleSpawnRate = 2500; // velocidad inicial de aparición de las tortugas
        let score = 0;
        let paused = false;
        let turtleIntervals = [];
        let cloudIntervals = [];
        let turtleSpawnTime = 2500;  // tiempo en milisegundos

        let music = document.getElementById("backgroundMusic");
        // let turtleSpawner = setInterval(createTurtle, turtleSpawnTime);
        let startTouchY = null;
        let gameRunning = true;
        let boatPositionLeft = 0; // O cualquier valor inicial.
        let startTouchX = null;
        let boatHorizontalPosition = boat.offsetLeft; // Asumiendo que 'boat' es el elemento que estás moviendo.
        let boatMoveAmount = 35; // La cantidad de píxeles que quieres que el barco se mueva con cada toque
        
        let lostTurtles = 0;
        let turtleCount = 0;
        const turtleSpawnTimeMin = 1500;  // tiempo en milisegundos
        let gameStopped = false; // variable global
        let turtleTimeoutID;
        var totalVidas = 10;
        
        
        gameArea.style.display='block'
        
        function spawnTurtle() {
            if (gameStopped || !gameRunning) return; // No crear más tortugas si el juego se ha detenido o si se ha perdido

            createTurtle(); // Siempre crea una tortuga
            console.log(turtleCount)
            console.log(turtleSpawnTime)
            console.log(turtleSpawnTime)
            // Si se han creado al menos 5 tortugas pero menos de 20, crea una adicional con una pequeña demora
            if (turtleCount >= 5 && turtleCount < 12) {
                setTimeout(createTurtle, 2000); // 500ms de demora
            }
            
            // Si se han creado al menos 20 tortugas, crea dos adicionales con pequeñas demoras
            if (turtleCount >= 12) {
                setTimeout(createTurtle, 2000); // Primera tortuga adicional con 500ms de demora
                setTimeout(createTurtle, 3500); // Segunda tortuga adicional con 1000ms de demora
            }

            // // Si se han creado al menos 20 tortugas, crea dos adicionales con pequeñas demoras
            // if (turtleCount >= 20) {
            //     setTimeout(createTurtle, 2000); // Primera tortuga adicional con 500ms de demora
            //     setTimeout(createTurtle, 3500); // Segunda tortuga adicional con 1000ms de demora
            //     setTimeout(createTurtle, 5000); // Segunda tortuga adicional con 1000ms de demora
            // }
            turtleSpawnTime = Math.max(turtleSpawnTime * 0.90, turtleSpawnTimeMin);  // No disminuir por debajo del tiempo mínimo
        
            setTimeout(spawnTurtle, turtleSpawnTime);
        }
        
        turtleTimeoutID = setTimeout(spawnTurtle, turtleSpawnTime);
        console.log("Timeout establecido, ID:", turtleTimeoutID);

        // Antes de pausar el juego
        const turtlesInScreen = [];

        

        document.getElementById("botonPausarLimpieza").addEventListener("click", function(){
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
              paused = !paused;  // Cambiar el estado de pausa
              document.getElementById('pauseModalLimpieza').style.display = 'block';
              // Antes de pausar el juego
                
              // Detener intervalos
              turtleIntervals.forEach(interval => {
                clearInterval(interval);
              });
            
              // Pausar animaciones de las tortugas en pantalla
              turtlesInScreen.forEach((turtle) => {
                turtle.style.animationPlayState = 'paused';
              });
        });
        
        document.getElementById("resumeButtonLimpieza").addEventListener("click", function(){
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
            document.getElementById('pauseModalLimpieza').style.display = 'none';

            // Reanuda los intervalos de las tortugas en pantalla utilizando la información almacenada
            turtlesData.forEach((turtleData, index) => {
                const interval = setInterval(function() {
                    // Utiliza turtleData.element para acceder al elemento de la tortuga
                    turtleData.position -= 12;
                    turtleData.element.style.left = turtleData.position + 'px';
            
                    // Tu lógica adicional aquí...
            
                }, turtleData.speed);
                turtleIntervals.push(interval);
            });

            paused = !paused;  // Cambiar el estado de pausa
        });
        // Inicializa la primera aparición
        // spawnTurtle();

        // Comenzar la música
        //music.play();
    
        //eventos
        document.addEventListener('keydown', function(e) {
            if (e.key === "p" || e.key === "P") {
                paused = !paused;  // Cambiar el estado de pausa
            }
        });
    
        document.addEventListener('keydown', function(e) {
            if (paused) return;
            
            if (boatMoving) return;
            const sea = document.getElementById('seaLimpieza');
    
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
            }
            */
        });
        document.addEventListener('keyup', function() {
            clearInterval(boatMoving);
            boatMoving = null;
        });
        // document.getElementById("botonVolverLimpieza").addEventListener("click", function() {
        //     setTimeout(function() {
        //         // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
        //         window.scrollTo(0, 1);
        //     }, 0);
        //     turtleIntervals.forEach(clearInterval);  
        //     clearInterval(boatMoving);  
        //     clearTimeout(turtleTimeoutID); // Añadir esta línea para detener el intervalo de spawnTurtle

        //     // Eliminar todas las tortugas del área de juego.
        //     const turtles = document.querySelectorAll('.basura');
        //     turtles.forEach(turtle => {
        //         if (sea.contains(turtle)) {
        //             sea.removeChild(turtle);
        //         }
        //     });
        //     resetGameFinal()
        // });
        document.getElementById("reiniciarLimpieza").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            resetGameFinal()
        });
        document.getElementById("reiniciarLimpiezaPrimero").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            resetGameFinal()
        });
        document.getElementById("botonSalirLimpieza").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            gameStopped = true;

            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            clearTimeout(turtleTimeoutID);
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaLimpieza');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.basura');
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
            turtleSpeed = 60;
            turtleSpawnRate = 1500;
            turtleSpawnTime = 1500;
            // music.volume = 0.6;
            score = 0;
            turtleCount =0;
            lostTurtles = 0;
            updateScore(score);
    
            document.getElementById('seaLimpieza').classList.remove('paused-animationLimpieza');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';

        });

        document.getElementById("salirPantallaLimpieza").addEventListener("click", function() {
            setTimeout(function() {
                // Esto hará que la barra de direcciones se oculte en dispositivos móviles.
                window.scrollTo(0, 1);
            }, 0);
            gameStopped = true;

            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            clearTimeout(turtleTimeoutID);
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaLimpieza');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.basura');
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
            turtleSpeed = 60;
            turtleSpawnRate = 1500;
            turtleSpawnTime = 1500;
            // music.volume = 0.6;
            score = 0;
            turtleCount =0;
            lostTurtles = 0;
            updateScore(score);

            document.getElementById('scoreScreenLimpieza').style.display = 'none';
    
            document.getElementById('seaLimpieza').classList.remove('paused-animationLimpieza');
            gameArea.style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('game1').style.display = 'block';
            document.getElementById('game2').style.display = 'block';
            document.getElementById('game3').style.display = 'block';

        });
        document.getElementById('botonUpLimpieza').addEventListener('click', function(event) {
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

        document.getElementById('botonDownLimpieza').addEventListener('click', function(event) {
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

        // gameArea.addEventListener('touchstart', function(event) {
        //     if (paused) return;
        
        //     let touchY = event.touches[0].clientY;
        
        //     // Calcula la posición vertical del sea en relación con gameArea
        //     let seaPosition = sea.getBoundingClientRect().top;
        
        //     // Ajusta la coordenada Y táctil restando la posición del sea en gameArea
        //     touchY -= seaPosition;
        
        //     // Actualiza boatPosition para reflejar la posición actual del barco antes de moverlo
        //     boatPosition = boat.offsetTop;
        
        //     // Si tocas por encima del centro del barco, muévelo hacia arriba
        //     if (touchY < boat.offsetTop + boat.clientHeight / 2) {
        //         boatPosition -= boatMoveAmount;
        //     }
        //     // Si tocas por debajo del centro del barco, muévelo hacia abajo
        //     else {
        //         boatPosition += boatMoveAmount;
        //     }
        
        //     // Restricciones para evitar que el barco salga del área de juego
        //     if (boatPosition < 0) boatPosition = 0;
        //     if (boatPosition > sea.clientHeight - boat.clientHeight) boatPosition = sea.clientHeight - boat.clientHeight;
        
        //     boat.style.top = boatPosition + 'px';
        // });
        
        // sea.addEventListener('touchend', function() {
        //     startTouchY = null;
        // });
    
        setInterval(function() {
            if (!gameRunning) return;
    
            //clearInterval(turtleSpawner);
            //turtleSpawner = setInterval(createTurtle, turtleSpawnRate);
        }, 10000); 
    
    
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
            updateBoatImage(); // Llama a esta función cada vez que actualices la puntuación

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
            clearTimeout(turtleTimeoutID);

            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaLimpieza');
    
            // Eliminar todas las tortugas del área de juego
            const turtles = document.querySelectorAll('.basura');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
                        // Resetea la posición del barco y otras variables del juego.
                        gameRunning = false;
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 60;
            turtleSpawnRate = 1500;
            turtleSpawnTime = 1500;
            music.volume = 0.6;
            score = 0;
            turtleCount =0;
            lostTurtles = 0;
            turtleSpawnTime = 2500
            

            updateScore(score);
    
            document.getElementById('seaLimpieza').classList.remove('paused-animationLimpieza');

            turtleTimeoutID = setTimeout(spawnTurtle, turtleSpawnTime);
    
        }

        function resetGameFinal() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            // Limpiar todos los intervalos que mueven las tortugas.
            turtleIntervals.forEach(clearInterval);
            turtleIntervals = [];
            
            // // Si ya existe un intervalo para el spawner de tortugas, detenerlo.
            // if (turtleTimeoutID) {
            //     clearInterval(turtleTimeoutID);
            // }
        
            // Asumiendo que ya tienes una referencia al elemento sea:
            const sea = document.getElementById('seaLimpieza');
            
            // Eliminar todas las tortugas del área de juego.
            const turtles = document.querySelectorAll('.basura');
            turtles.forEach(turtle => {
                if (sea.contains(turtle)) {
                    sea.removeChild(turtle);
                }
            });
            
            // Resetea la posición del barco y otras variables del juego.
            paused = false;
            boatPosition = gameArea.clientHeight / 2 - boat.clientHeight / 2;
            boat.style.top = boatPosition + 'px';
            turtleSpeed = 80;
            turtleSpawnRate = 2000;
            music.volume = 0.6;
            score = 0;
            lostTurtles = 0;
            turtleCount =0;
            gameRunning = true;
            turtleSpawnTime = 2500
            updateScore(score);
            restaurarBarco()
            document.getElementById('vidas').innerHTML ='';
            document.getElementById('vidas').innerHTML = totalVidas;
            document.getElementById('playerNameLimpieza').value = '';
            document.getElementById("scoreScreenLimpieza").style.display = "none";
            document.getElementById("scoreDatosLimpieza").style.display = 'block';
            document.getElementById("scoreListaLimpieza").style.display = 'none';
            document.getElementById('seaLimpieza').classList.remove('paused-animationLimpieza');
            moveCloud(document.getElementById('cloudLimpieza1'), 50);  
            moveCloud(document.getElementById('cloudLimpieza2'), 60); 
            moveCloud(document.getElementById('cloudLimpieza3'), 70);
            // Establecer el spawner de tortugas después de resetear las variables.
            // turtleTimeoutID = setInterval(createTurtle, turtleSpawnRate);
            turtleTimeoutID = setTimeout(spawnTurtle, turtleSpawnTime);

            // console.log(turtleSpawnTime)
            // console.log(turtleTimeoutID)
        }
        function restaurarBarco(){
            boat.removeAttribute('class')
            boat.classList.add('objectLimpieza', 'barcoEstadoNormal')
            
            
        }
        const turtlesData = [];

        function createTurtle() {
            if (paused) return;
        
            function getRandomRotation() {
                return Math.random() < 0.5 ? 35 : -35;
            }
        
            const sea = document.getElementById('seaLimpieza'); 
            const turtle = document.createElement('div');
            turtle.classList.add('objectLimpieza', 'basura');

            const randomTipo = Math.floor(Math.random() * 3) + 1; // Esto dará 1, 2 o 3
            turtle.classList.add('tipo' + randomTipo);
            
            const rotation = getRandomRotation();
            turtle.style.transform = `rotate(${rotation}deg)`;
        
            let randomTop = Math.random() * (sea.clientHeight - 50);
            turtle.style.top = randomTop + 'px';
            // turtleSpawnTime *= 0.20;  // decrementa el tiempo en un 5%
            turtleCount++; // Aumenta el contador de tortugas

            sea.appendChild(turtle); 

            const turtleData = {
                element: turtle, // Asegúrate de que 'turtle' sea una referencia válida al elemento de la tortuga
                speed: turtleSpeed,
                position: turtle.offsetLeft
            };
            //turtlesInScreen.push(turtle);
            const turtleInterval = setInterval(function() {
                turtle.style.left = (turtle.offsetLeft - 12) + 'px'; 
        
                // Si la tortuga sale de la pantalla por la izquierda
                if (turtle.offsetLeft + turtle.clientWidth <= 0) {
                    lostTurtles++;
                    // crashSound.play();
                    // console.log(lostTurtles)
                    
                    if (lostTurtles >= totalVidas) {
                        console.log('perdiste')
                        gameRunning = false;
            
                        crashSound.play();
            
                        paused = true;
                        music.volume = 0.3;
        
                        turtleIntervals.forEach(clearInterval);  
                        cloudIntervals.forEach(clearInterval);
                        clearInterval(boatMoving);  
                        //clearInterval(turtleSpawner); 
                        console.log("Deteniendo timeout, ID actual:", turtleTimeoutID);
 
                        clearTimeout(turtleTimeoutID); // Añadir esta línea para detener el intervalo de spawnTurtle


                        document.getElementById('seaLimpieza').classList.add('paused-animationLimpieza');
        
                        showScoreScreen(score);
                    } else {
                        // let savedSound = document.getElementById("savedSound");
                        // savedSound.play();
                        crashSound.play();
                        document.getElementById('vidas').innerHTML ='';
                        var vidas = lostTurtles == 0 ? totalVidas : totalVidas - lostTurtles
                        document.getElementById('vidas').innerHTML = vidas;

                    }
        
                    if (sea.contains(turtle)) {
                        sea.removeChild(turtle);
                    }
                    clearInterval(turtleInterval);
                }
        
                // Recoger la tortuga con el barco
                const overlapMargin = 2;
                if (turtle.offsetLeft < boat.offsetLeft + boat.offsetWidth - overlapMargin &&
                    turtle.offsetLeft + turtle.offsetWidth > boat.offsetLeft + overlapMargin &&
                    turtle.offsetTop + turtle.offsetHeight > boat.offsetTop + overlapMargin &&
                    turtle.offsetTop < boat.offsetTop + boat.offsetHeight - overlapMargin) {
                        let savedSound = document.getElementById("savedSound");
                        savedSound.play();
                    updateScore(5);
                    if (sea.contains(turtle)) {
                        
                        sea.removeChild(turtle);
                    }
                    clearInterval(turtleInterval);
                }
        
            }, turtleSpeed);
            // turtlesInScreen.push(turtle);
            turtlesData.push(turtleData);

            turtleIntervals.push(turtleInterval);
        }
        
        function updateBoatImage() {
            if (score >= 30) {
              boat.classList.add('barcoEstado6');
            } else if (score >= 15) {
              boat.classList.add('barcoEstado4');
            } else if (score >= 5) {
              boat.classList.add('barcoEstado2');
            }
          }

        function moveCloud(cloudElement, duration) {
            const sky = document.getElementById('skyLimpieza');
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
            const sky = document.getElementById('skyLimpieza');
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
            console.log('Pantalla Puntuacion');
            document.getElementById("finalScoreLimpieza").textContent = score;
            document.getElementById("scoreScreenLimpieza").style.display = "block";
            // Puedes cargar las puntuaciones aquí también:
            displayTopScores();
        }
    
        function saveScore() {
            let playerName = document.getElementById("playerName").value;
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

        document.getElementById("saveScoreLimpieza").addEventListener("click", function() {
            const playerName = document.getElementById('playerNameLimpieza').value;
            // const score = 100;  // Cambia esto por la puntuación deseada

            fetch('https://trasmapiback.hawkins.es/api/save/limpieza', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `playerName=${playerName}&score=${score}`,

            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Confirmación desde Laravel
            
                // Obtener y mostrar los top 10
                fetch('https://trasmapiback.hawkins.es/api/data/limpieza')
                    .then(response => response.json())
                    .then(data => {
                        const sortedData = data.sort((a, b) => b.puntuacion - a.puntuacion);
                        const top10 = sortedData.slice(0, 10);
                        document.getElementById("scoreDatosLimpieza").style.display = 'none';
                        document.getElementById("scoreListaLimpieza").style.display = 'block';
                        displayScores(top10);
                    })
                    .catch(error => {
                        console.error('Error al cargar datos:', error);
                    });
            })
            .catch(error => {
                console.error('Error al guardar datos:', error);
            });

        });

        function displayScores(scores) {
            const tableBody  = document.getElementById('tbodyLimpieza');
        
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
    
        // iniciar
        // Establecer la posición inicial de las nubes:
        setInitialCloudPosition(document.getElementById('cloudLimpieza1'));
        setInitialCloudPosition(document.getElementById('cloudLimpieza2'));
        setInitialCloudPosition(document.getElementById('cloudLimpieza3'));
    
        // Luego inicializa el movimiento de las nubes.
        moveCloud(document.getElementById('cloudLimpieza1'), 50);  
        moveCloud(document.getElementById('cloudLimpieza2'), 60); 
        moveCloud(document.getElementById('cloudLimpieza3'), 70);
    }
}