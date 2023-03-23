<?php
    // creamos sesion
    @session_start();

    // guardamos datos del login en la sesion
    if (isset($_POST['nombre'] )){
        $_SESSION['nombre'] = $_POST['nombre'];  
        $_SESSION['id'] = $_POST['id'];  
        $_SESSION['administrador'] = $_POST['admin'];
    }    

    // si no existe la variable de sesion, volvemos a inicio
    if (isset($_SESSION['nombre'] )){
        // no hacer nada
    } else {        
        session_destroy();
        header('Location: ../index.php');
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>

    <!-- Meta Tags -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Tittle -->
    <title>Biblioteca de Proyectos | Buscador </title>    
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../assets/librerias/bootstrap.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../css/general.css">     

</head>
<body>
    
    <div class="container-fluid">
        <!-- Cabecera -->
        <div class="row" id="cabecera">    
            <div class="col">
                <div class="row justify-content-end p-1 headRow">
                    <div class="col-auto">
                        <a href="https://facebook.com/CIPFPD" class="ms-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                            </svg>
                        </a>                    
                        <a href="https://twitter.com/cipfpd_rioja" class="ms-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                            </svg>
                        </a>                    
                        <a href="http://correo.fpdrioja.com" class="ms-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                            </svg>
                        </a>                    
                        <a href="https://instagram.com/cipfpd_rioja" class="ms-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                            </svg>
                        </a>                         
                    </div>
                    <div class="col-auto">
                        <a class="text-decoration-none"  target="blank" href="https://fpdrioja.es/">Acceso CIPFPD</a>
                    </div>
                    <div class="col-auto">
                        <a class="text-decoration-none" target="blank" href="https://aulaempleo.fpdrioja.com/">Acceso Aula Virtual Empleo</a>
                    </div>
                    <div class="col-auto">
                        <a class="text-decoration-none" target="blank" href="https://mail.google.com/mail/u/3/#inbox">Acceso Correo CIPFPD</a>
                    </div>
                    <div class="col-auto">
                        <a class="text-decoration-none" target="blank" href="https://ias1.larioja.org/casLR/login?inst=E&param=anonimo%B7true&TARGET=https%3A%2F%2Fracima.larioja.org%2Fracima%2FidentificacionCAS.jsp">Acceso a RACIMA</a>
                    </div>
                    <div class="col-auto">
                        <a class="text-decoration-none" target="blank" href="https://aulavirtual-fpdrioja.larioja.org/login/index.php?auth=manual">Acceso Aula Virtual Educación</a>
                    </div>
                </div>

                <div class="row my-3" id="user">
                    <div class="col-8 col-md-3 offset-1">
                        <img class="img-fluid" src="../assets/imagenes/FPD_header.png" alt="logo del cipfpd">
                    </div>
                    <div class="col-8 col-md-6 text-end text-uppercase fs-5">
                        <div class="row">
                            <div class="col">
                                <p class="mb-0"><?php echo $_SESSION['nombre'] ?></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <?php 
                                    if ($_SESSION['administrador']) {
                                        print ('<a class="fs-6 fw-light" href="./gestionProfesores.php">Gestionar profesores</a>');
                                    }
                                ?>
                                <a class="fs-6 fw-light" href="./nuevoProyecto.php">Nuevo Proyecto</a>
                                <button class="btn p-1" onclick="logout()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
                                        <path d="M7.5 1v7h1V1h-1z"/>
                                        <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>                        
                    </div>
                    <div class="col-auto my-auto userConf"> 
                        <a href="./gestionUsuario.php">                       
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                            </svg>
                        </a>
                    </div>                   
                </div>

                <div class="row">
                    <div class="col imgCol"></div>
                </div>
            </div>    
        </div>
        
        <!-- Buscador -->
        <div class="row p-5 justify-content-center" id="buscador">
            <div class="col-md-8">                
                    <div class="row">     
                        <div class="col-12 col-sm-8 mb-3 text-center">
                            <label for="busquedaNombre" class="form-label h4">Buscador de proyectos</label>
                        </div>       
                        <div class="col-12 col-sm-4">                            
                            <select class="form-select text-start text-sm-end" id="busquedaCiclo">
                               <!-- options en selectCiclos() del js -->
                            </select>
                        </div>            
                    </div>   
                    <div class="row">
                        <div class="col-12 col-sm-8 order-2 order-sm-1">
                            <input class="form-control" id="busquedaNombre" type="text" placeholder="Nombre de proyecto/Alumno..." maxlength="256">
                        </div>
                        <div class="col-12 col-sm-4 order-1 order-sm-2">
                            <select class="form-select text-start text-sm-end" id="busquedaCurso">
                                <!-- options en selectCursos() del js -->
                            </select>
                        </div>
                    </div>                     
            </div>
            <div class="col-md-8 mt-0 mt-sm-3">                
                <div class="row">   
                    <div class="col-12 col-md-7 mb-3 text-center">
                        <div class="row align-items-center">                            
                            <div class="col-10 col-sm-7 col-md-8 pe-0 me-0">
                                <input class="form-control" list="datalistEtiquetas" id="busquedaEtiqueta" type="text" placeholder="Etiqueta..." onkeyup="this.value=sinEspacios(this.value)" maxlength="50">                                                       
                                <datalist id="datalistEtiquetas">
                                    <!-- options en datalistOptions() del js -->
                                </datalist>
                            </div> 
                            <div class="col-auto g-0">
                                <button class="btn btn-light align-self-center p-1" id="btnEtiqueta" onclick="buscadorAniadirEtiquetas($('#busquedaEtiqueta').val())">
                                    <svg id="svgPlus" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.7em" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="row mt-3" id="listaEtiquetas"></div>
                    </div>       
                    <div class="col-10 col-md-5"  style="height: 15em" id="nubeEtiquetas"></div>
                </div>
            </div>
            <div class="col-md-8 mt-3">
                <div class="col-12">
                    <button class="btn btn-light" onclick="mostrar()" id="hook">Realizar búsqueda ></button>                
                </div>            
            </div>
        </div>        

        <!-- Resultados -->
        <div class="row justify-content-center" id="paginacion">            
        </div>
        <div class="row justify-content-center" id="resultados">            
        </div>
        <div class="row justify-content-center" id="paginacionPie">            
        </div>

        <!-- Pie de página -->
        <div class="row" id="pie">
            <div class="col">
                <div class="row"></div>
                    <div class="row justify-content-center">
                        <div class="col-3 p-2 m-3">
                            <div class="row mb-4">
                                <img src="../assets/imagenes/FPD-logo_horizontal-negativo.png" alt="" title="FPD-logo_horizontal">
                            </div>
                            <div class="row">
                                <div><strong>Dirección: </strong></div>
                                <div>Avenida de Lobete nº 17, 26003 Logroño</div>
                                <div><strong>Teléfono:</strong> 941 294 530</div>
                                <div><strong>e-mail:</strong><span>&nbsp;</span><a style="color:#2ea3f2;" href="mailto:cipfpd@fpdrioja.com" target="_blank" data-mt-detrack-inspected="true" data-mt-detrack-attachment-inspected="true" rel="noopener">cipfpd@fpdrioja.com</a></div>
                                <div><a style="color:#2ea3f2;" href="https://drive.google.com/file/d/13GQozb8T6emo_kc2JMS61AobAetrBjEI/view?usp=sharing" target="_blank" rel="noopener">Descargar Política de Privacidad</a></div>			
                            </div>
                        </div>
                        <div class="col-3 p-2 m-3">
                            <p>El Centro Integrado Público de Formación Profesional a Distancia de La Rioja pretende contribuir a la cualificación y recualificación de las personas a lo largo de la vida independientemente de su situación personal, profesional o ubicación.&nbsp;</p>
                        </div>
                        <div class="col-3 p-2 m-3">
                        <p>Todo ello mediante una oferta de formación profesional coordinada, modular, flexible, de calidad y a distancia adaptada a las demandas de la población de La Rioja y a las necesidades generadas por las empresas.&nbsp;</p>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-10 m-3 mb-5">
                        <img class="img-fluid" src="../assets/imagenes/logos_Web.png" alt="Logos FSE" title="logos_Web">
                        </div>
                    </div>
                </div>
        </div>

        <!-- modal -->
        <div class="row">
            <div class="col" id="modal"></div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script type="text/javascript" src="../assets/librerias/bootstrap.js"></script>
    <!-- JQuery-->
    <script type="text/javascript" src="../assets/librerias/jquery-3.6.js"></script>    
    <script type="text/javascript" src="../assets/librerias/jQWCloudv3.4.1.js"></script>
    <!-- PDF.JS -->
    <script type="text/javascript" src="../assets/librerias/pdf.js"></script>
    <!-- Custom JS -->    
    <script type="text/javascript" src="../assets/librerias/configuracion/confSelects.js"></script>
    <script type="text/javascript" src="./js/buscador.js"></script>    
    
</body>
</html>