<?php
    /**
     * Consulta para añadir un proyecto
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];   
    $proxID;  
    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];
    $ciclo = $_POST["ciclo"];
    $curso = $_POST["curso"]; 
    $nota = $_POST["nota"]; 
    $alumno = $_POST["alumno"];
    $etiquetas = $_POST["etiquetas"];
    $archivoTemporal = $_FILES['archivo']['tmp_name'];
    $nombreArchivo = $_FILES['archivo']['name'];   

    // tratamos las comillas simples para que se puedan añadir
    $nombre = str_replace("'","\'",$nombre);
    $alumno = str_replace("'","\'",$alumno);
    $descripcion = str_replace("'","\'",$descripcion);
    $etiquetas = str_replace("'","\'",$etiquetas);

    // // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }

    //sleep(5);

    // CONSULTAS    
    // insert
    try {  
        $consulta = $conBBDD -> prepare("SHOW TABLE STATUS LIKE 'proyectos'");
        $dato = $consulta -> execute();
        $dato = $consulta -> fetch(PDO::FETCH_ASSOC);  
                 
        // creamos la consulta actualizando la url del archivo        
        $consulta = $conBBDD -> prepare("INSERT INTO proyectos(nombre,descripcion,ciclo,curso,alumno,etiquetas,archivo_PDF,nota) VALUES ('".$nombre."', '".$descripcion."', '".$ciclo."', '".$curso."', '".$alumno."', '".$etiquetas."', '".$dato['Auto_increment']."_".$nombreArchivo."', '".$nota."')");
        $datos = $consulta -> execute();   
        // movemos el archivo a su carpeta si el insert ha ido bien
        if ($datos) {
            move_uploaded_file($archivoTemporal, '../../archivos/'.$dato['Auto_increment']."_".$nombreArchivo);                  
        }
        
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