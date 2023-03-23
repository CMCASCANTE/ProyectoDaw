<?php
    /**
     * Consulta para modificar la contraseña del profesor
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    $id = $_POST["id"]; 
    $password = hash('sha256', $_POST["password"]);
    



    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS    
    // update
    try {
        // consulta preparada        
        $consulta = $conBBDD -> prepare("UPDATE profesores SET pswrd='".$password."' WHERE id =". $id);    
        // guardamos el resultado
        $datos = $consulta -> execute();                      
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