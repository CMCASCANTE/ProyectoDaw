<?php
    /**
     * Consulta para listar los proyectos segun lo que se busque en la página del buscador
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];    
    $nombre = $_POST["nombre"];
    $ciclo = $_POST["ciclo"];
    $curso = $_POST["curso"];  
    $etiquetas = "";
    if (isset($_POST["etiquetas"])) {
        $listaEtiquetas = $_POST["etiquetas"];
        foreach ($listaEtiquetas as $key => $etiqueta) {
            $etiquetas .= 'AND etiquetas like"%'.$etiqueta.'%"';
        }
    }

    // tratamos las comillas simples para que se puedan añadir
    $nombre = str_replace("'","\'",$nombre);        
    $etiquetas = str_replace("'","\'",$etiquetas);

    //sleep(5);

    // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }



    // CONSULTAS
    // select para obtener la lista de proyectos
    try {
        // consulta preparada
        $consulta = $conBBDD -> prepare("SELECT * FROM proyectos WHERE (nombre like'%". $nombre ."%' OR alumno like'%". $nombre ."%') 
                                        AND ciclo like'%". $ciclo ."%' AND curso like'%". $curso ."%' ". $etiquetas);            
        $consulta -> execute();   
        // guardamos el numero de resultados           
        $numResultados = $consulta -> rowCount();
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
    $data['num'] = $numResultados;
    $data['rows'] = $datos;
    //echo json_encode($numResultados);    
    echo json_encode($data);    

?>