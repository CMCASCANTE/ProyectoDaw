<?php
    /**
     * Consulta para listar las etiquetas
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];   
    if (isset($_POST['curso'])) {
        $curso = $_POST['curso'];
    } else {
        $curso = "";
    }



    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS
    // select para obtener la lista de etiquetas
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("SELECT etiquetas FROM proyectos WHERE ciclo like '%". $curso ."%'");
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