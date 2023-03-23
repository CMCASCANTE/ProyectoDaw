<?php
    /**
     * Consulta para añadir profesores
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];    
    $password = hash('sha256', $_POST["password"]);



    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS    
    // select para añadir un profesor
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("INSERT INTO profesores(nombre,email,pswrd,administrador) VALUES (:nombre, :email, :password, 0)");
        $params = [
            'nombre' => $nombre,
            'email' => $email,
            'password' => $password,
        ];
        // guardamos el resultado (true si tiene exito false si no)
        $datos = $consulta -> execute($params);                      
        //$datos = $consulta->errorInfo(); // comprobación de errores en la consulta
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