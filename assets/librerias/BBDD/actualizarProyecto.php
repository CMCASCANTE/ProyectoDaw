<?php
    /**
     * Consulta para actualizar un proyecto
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];
    $id = $_POST["id"]; 
    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];
    $ciclo = $_POST["ciclo"];
    $curso = $_POST["curso"]; 
    $alumno = $_POST["alumno"];
    $etiquetas = $_POST["etiquetas"];

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
    // Update 
    try {
        // consulta preparada
        // comprobamos si hay un archivo
        if (isset($_FILES['archivo'])) {            
            $archivoTemporal = $_FILES['archivo']['tmp_name'];
            $nombreArchivo = $_FILES['archivo']['name'];     
            $nombreArchivoOriginal = $_POST['archivoOriginal'];
            // eliminamos el original y movemos el archivo a la carpeta correspondiente añadiendo el ID al nombre por seguridad (igual que al añadir un proyecto nuevo)
            unlink('../../archivos/'.$nombreArchivoOriginal);
            move_uploaded_file($archivoTemporal, '../../archivos/'.$id."_".$nombreArchivo);
            // creamos la consulta actualizando la url del archivo
            $consulta = $conBBDD -> prepare("UPDATE proyectos SET nombre='".$nombre."', descripcion='".$descripcion."', ciclo='".$ciclo."', curso='".$curso."', alumno='".$alumno."', etiquetas='".$etiquetas."', archivo_PDF='".$id."_".$nombreArchivo."' WHERE id =". $id);    
        } else {
            // si no hay archivo actualizmos el resto de campos
            $consulta = $conBBDD -> prepare("UPDATE proyectos SET nombre='".$nombre."', descripcion='".$descripcion."', ciclo='".$ciclo."', curso='".$curso."', alumno='".$alumno."', etiquetas='".$etiquetas."' WHERE id =". $id);
        }
        // ejecutamos la consulta
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