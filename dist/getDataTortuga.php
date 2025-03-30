<?php
$filename = "playerDataTortugas.json";

// Verifica si el archivo existe
if (file_exists($filename)) {
    echo file_get_contents($filename);
} else {
    echo json_encode([]);  // Retorna un array vacío si no hay datos
}
?>
