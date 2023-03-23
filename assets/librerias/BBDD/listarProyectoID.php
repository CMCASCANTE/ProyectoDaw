<?php
    /**
     * Consulta para listar los proyectos segun id
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
    // select para obtener un proyecto segun id
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("SELECT * FROM proyectos WHERE id =". $id);
        $consulta -> execute();              
        // por defecto devuelve un array numerico y otro asociativo, ocn esta opcion solo devolvemos el asociativo
        $datos = $consulta -> fetch(PDO::FETCH_ASSOC);            
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