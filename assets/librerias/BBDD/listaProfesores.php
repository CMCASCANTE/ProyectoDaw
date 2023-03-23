<?php
    /**
     * Consulta para listar los profesores
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    
    


    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS    
    // select de profesores que no sean administradores
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("SELECT email,nombre,id,administrador FROM profesores WHERE administrador=0");
        $consulta -> execute();              
        // por defecto devuelve un array numerico y otro asociativo, ocn esta opcion solo devolvemos el asociativo
        $datos = $consulta -> fetchAll(PDO::FETCH_ASSOC);            
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