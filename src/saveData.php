<?php

$filename = "playerData.json";

if (isset($_POST['playerName']) && isset($_POST['score'])) {
    $playerName = $_POST['playerName'];
    $score = $_POST['score'];
    
    // Leer el archivo existente
    $data = [];
    if (file_exists($filename)) {
        $currentData = file_get_contents($filename);
        $data = json_decode($currentData, true);
    }

    // Añadir el nuevo dato
    $data[] = [
        'playerName' => $playerName,
        'score' => $score
    ];

    // Escribir los datos actualizados en el archivo
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
}

echo "Datos guardados en JSON.";

?>

