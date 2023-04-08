<?php
    /**
     * Consulta para actualizar un proyecto
     */
    require_once "datosConexion.php";


    //variables para las consultas    
    $datos = [];
    

    // // conexion con la base de datos
    try {        
        $conBBDD = new PDO($dsn, $user, $pass);        
    } catch (Exception $e) {
        $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
    }

    // si la peticion tiene un valor de permiso de Notas entra aqui
    if (isset($_POST['permNotas'])) {
        $perm = $_POST['permNotas'];     
        
        // Update 
        try {                  
            if ($perm) {                                
                // consulta preparada
                $consulta = $conBBDD -> prepare("UPDATE permisos SET valor='1' WHERE permiso = 'notas'");    
            } else {                           
                // consulta preparada
                $consulta = $conBBDD -> prepare("UPDATE permisos SET valor='0' WHERE permiso = 'notas'");    
            }            
            // ejecutamos la consulta
            $consulta -> execute();              
            // por defecto devuelve un array numerico y otro asociativo, ocn esta opcion solo devolvemos el asociativo
            $datos = $consulta -> fetch(PDO::FETCH_ASSOC);                    
        } catch (Exception $e) {
            $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
        }  
    // si la peticion no tiene valor de permiso de Notas, devuelve solo el select  
    } else {
        try {
            // consulta preparada
            $consulta = $conBBDD -> prepare("SELECT valor FROM permisos WHERE permiso = 'notas'");                
            // ejecutamos la consulta
            $consulta -> execute();              
            // por defecto devuelve un array numerico y otro asociativo, ocn esta opcion solo devolvemos el asociativo
            $datos = $consulta -> fetch(PDO::FETCH_ASSOC);                    
        } catch (Exception $e) {
            $datos = "Se ha producido el siguiente error: " . $e -> getMessage();        
        }    
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