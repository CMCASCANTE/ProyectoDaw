<?php
    /**
     * Consulta para el login de profesor
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    $usuario = $_POST["user"]; 
    $password = hash('sha256', $_POST["password"]);
    



    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS    
    // select para comprobar que existe el profesor
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("SELECT email,nombre,id,administrador FROM profesores WHERE email ='". $usuario . "' AND pswrd ='". $password."'");
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