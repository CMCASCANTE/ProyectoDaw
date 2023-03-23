<?php
    /**
     * Consulta eliminar usuarios
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    $id = $_POST["id"]; 



    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS    
    // delete
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("DELETE FROM profesores WHERE id =". $id);        
        // recogemos el resultado
        $done = $consulta -> execute();                      
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }    



    // cerrar conexion
    try {
        $conBBDD = null;
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }    



    // salida de datos en JSON      
    echo json_encode($datos);    

?>