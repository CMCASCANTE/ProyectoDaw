/**
 * JS para la página del buscador
 */



// cargas iniciales de JS
window.onload = function () {  

    // añadir al input de busquedas que cargue al pulsar intro
    $( "#busquedaNombre" ).keypress(function( event ) {
        if ( event.which == 13 ) {
           event.preventDefault();
           $('#hook').click();
        }
    })

    // añadir al input de añadir etiuquetas que las añada al pulsar intro
    $( "#busquedaEtiqueta" ).keypress(function( event ) {
        if ( event.which == 13 ) {
           event.preventDefault();
           $('#btnEtiqueta').click();
        }
    })
}    






// datos de uso general
const etiquetas = [];







/***
 * BUSCADOR
 * al iniciar la busqueda cargamos los valores del formulario de busquedas y enviamos con ajax una peticion 
 * para traer los resultados de la base de datos
 * despues los mostramos   
 */
function mostrar(proyectoEliminado = '') { 
    // datos para la búsqueda
    const nombre = $("#busquedaNombre").val();
    const ciclo = $("#busquedaCiclo").val();
    const curso = $("#busquedaCurso").val();            
    const arrayEtiquetas = $('#listaEtiquetas').children().children("input[type='text']").toArray();
    const valorEtiquetas = [];    
    arrayEtiquetas.forEach(child => {
        valorEtiquetas.push(child.value)
    })       

    // eliminamos el contenido anterior
    $("#resultados").empty();
    
    // peticion ajax para obtener la lista de proyectos segun lo que se busque
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listarProyectosCount.php",
        data: {nombre: nombre, ciclo: ciclo, curso: curso, etiquetas: valorEtiquetas},
        dataType: "json"       
    }) // manejo del resultado de la petición
    .done(function(data) {                 
        const numRows = data['COUNT(*)'];  
        const nResultados = numRows;
        const nPaginas = Math.ceil(nResultados/5);            
        let paginaActual = 1;   

        // eliminamos la opcion de paginado para que no se repita si existe
        if ($('.paginado')) {
            $('.paginado').remove();
        }        

        // si hay mas de 5 posibles resultados cargamos la paginación
        if (numRows > 5) {    
            // guardamos el paginado para añadirlo despues tanto al principio como al final            
            const pag = $('<div>', {'class': 'col-md-8 paginado'}).append(
                    $('<div>', {'class': 'row justify-content-between align-items-end'}).append(                
                        $('<div>', {'class': 'col-6'}).append(
                            $('<span>', {'id': 'proyectoEliminado'})
                        ),                               
                        $('<div>', {'class': 'col-6 divPag'}).append(
                            $('<div>', {'class': 'row justify-content-end'}).append(                                
                                $('<div>', {'class': 'col-auto g-0 estiloPag'}).append(
                                    $('<button>', {'class': 'btn fs-4 ps-0 fw-light', 'html': '&laquo'}).click(()=>{                                                                                           
                                        if (paginaActual>1){                                
                                            paginaActual--;
                                            $("#resultados").empty(); 
                                            $(".nPaginas").html(paginaActual + '...' + nPaginas);
                                            // listamos los primeros 5 resultados de la búsqueda
                                            resultPag(nombre, ciclo, curso, valorEtiquetas, (paginaActual-1)*5, ((paginaActual-1)*5)+5)
                                        }
                                        window.location.href = "#hook";
                                    })
                                ),
                                $('<div>', {'class': 'col-auto align-self-center g-0 fs-5 estiloPagNum'}).append(
                                    $('<span>', {'class': 'nPaginas fw-light', 'id': '1nPaginas', 'html': '1...' + nPaginas})
                                ),
                                $('<div>', {'class': 'col-auto g-0 estiloPag'}).append(
                                    $('<button>', {'class': 'btn fs-4 pe-0 fw-light', 'html': '&raquo'}).click(()=>{                                        
                                        if (paginaActual<nPaginas){                                
                                            paginaActual++;
                                            $("#resultados").empty();                                                    
                                            // listamos los primeros 5 resultados de la búsqueda
                                            resultPag(nombre, ciclo, curso, valorEtiquetas, (paginaActual-1)*5, ((paginaActual-1)*5)+5)
                                        }
                                        if (paginaActual===nPaginas){
                                            $(".nPaginas").html(paginaActual + '/' + nPaginas);
                                        } else {
                                            $(".nPaginas").html(paginaActual + '...' + nPaginas);
                                        }                                                   
                                        window.location.href = "#hook";
                                    })
                                )                                
                            )
                        )
                    )
                )            
            $('#paginacion').append($(pag).clone(true))
            $('#paginacionPie').append($(pag).clone(true))

        // si no hay mas de 5 resultados cargamos los que haya o indicamos que no hay en caso de ser 0    
        } else {
            console.log("asdasd")
            if (numRows == 0) {
                $('#paginacion').append(
                    $('<div>', {'class': 'col-md-8 paginado'}).append(
                        $('<span>', {'class': 'text-danger', 'html': 'No se han encontrado resultados...'}).append(         

                        )
                    )
                )
            } else {
                // creamos el span de elementos eliminados por si lo llegamos a usar
                $('#paginacion').append(
                    $('<div>', {'class': 'col-md-8 paginado'}).append(
                        $('<div>', {'class': 'row align-items-end'}).append(                
                            $('<div>', {'class': 'col-6'}).append(
                                $('<span>', {'id': 'proyectoEliminado'})
                            )                               
                        )
                    )
                )               
            }
        }       

        // listamos los primeros 5 resultados de la búsqueda
        resultPag(nombre, ciclo, curso, valorEtiquetas, 0, 5)

        
        // Si acbamos de eliminar un proyecto 
        if (proyectoEliminado) {
            $('#proyectoEliminado').html('El proyecto ' + proyectoEliminado + ' ha sido eliminado');
            //$('#proyectoEliminado').removeClass('mensajeFade');
            $('#proyectoEliminado').addClass('mensajeFade');    
        }

        // movemos la vista de la web al inicio del buscador
        window.location.href = "#hook";
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}
// Funcion para cargar el numero de resultados indicado (lim1, lim2)
function resultPag(nombre, ciclo, curso, valorEtiquetas, lim1, lim2){
    // peticion para mostrar los resultados
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listarProyectos.php",
        data: {nombre: nombre, ciclo: ciclo, curso: curso, etiquetas: valorEtiquetas, resultIni: lim1, resultFin: lim2},
        dataType: "json",
        // mientras esperamos la respuesta...
        beforeSend: ()=> {           
            $('#resultados').append(
                $('<div>', {'class': 'col-2'}).append(
                    $('<div>', {'class': 'loader'})
                )
            )          
        }           
    }) // manejo del resultado de la petición
    .done(function(data) {   

        // eliminamos el contenido anterior (loader)
        $("#resultados").empty();
        // mostramos los resultados
        buscadorMostrarResultados(data);

    }).fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })         
}






/***
 * EDITAR PROYECTOS
 * cuando pulsamos el boton de editar recogemos el div del proyecto
 * eliminamos el div actual y creamos uno nuevo con la funcion formularioEditarProyecto
 * con todos los campos para la edicion 
 */
function editarProyecto(id) {
    // guardamos en div principal 
    const div = $('#proy_'+id);
    // limpiamos caja de busquedas    
    div.empty();    
    
    // obtenemos todos los datos del proyecto y cremos el formulario para editar los datos
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listarProyectoID.php",
        data: {id: id},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {
        // creacion de formulario 
        const formEditar = formularioEditarProyecto(data);
       
        // añadimos el formulario al div principal
        $(div).append(formEditar);
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}










/***
 * MOSTRAR RESULTADOS BUSCADOR
 * cuando tenemos los resultados de la busqueda, usamos esta funcion para
 * mostrar cada linea de resultado para cada proyecto
*/
function lineaResultado(proyecto){   
    // lista de etiquetas
    const listaEtiquetas = proyecto.etiquetas.split(" ");
    const divEtiquetas = []
    listaEtiquetas.forEach(etiqueta => {
        // creamos las etiquetas con sus atributos
        const divEtiqueta = $("<div>", {
            'class': 'col-auto g-0 mb-2 me-2 tagDiv'
        });
        const inputEtiqueta = $("<input>", {   
            'class': 'tags',
            'type': 'text', 
            'size': etiqueta.length,
            'disabled': true,
            'value': etiqueta,                        
        });                
        // añadimos las etiquetas al div correspondiente
        divEtiqueta.append(inputEtiqueta);    
        // metemos el div en el array de divs
        divEtiquetas.push(divEtiqueta)    
    });    

    // manejo del pdf para mostrar la portada   
    // archivo PDF 
    const archivo = '../assets/archivos/'+proyecto.archivo_PDF;
    // archivo worker para pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../assets/librerias/pdf.worker.js';
    // lanzamos tarea asincrona para cargar pdf
    pdfjsLib.getDocument(archivo).promise.then(function(pdf) {        
        // cargamos la pagina
        pdf.getPage(1).then(function(page) {
            // obtenemos el canvas y le damos las dimensiones que tiene que tener (escalando el tamaño del pfg)
            const canvas = $('#canvas_'+proyecto.id)[0];            
            const viewport = page.getViewport({scale: 0.22});
            const ctx = canvas.getContext('2d');          
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height =  Math.floor(viewport.height) + "px";
            
            // renderizamos el pdf en el canvas
            page.render({
                canvasContext: ctx,                
                viewport: viewport
            })            
          });        
    });
    
    // creacion de elementos HTML
    const resultado = $('<div>', {'class': 'col-lg-10 col-xl-8 col-xxl-8 mt-4 busquedaRow'}).append(
        $('<div>', {'class': 'row  h-100 justify-content-center', 'id': 'proy_'+proyecto.id}).append(
            // portada pdf
            $('<div>', {'class': 'col-4 col-md-2 p-2 position-relative'}).append(                    
                $('<canvas>', {'id': 'canvas_'+proyecto.id, 'class': 'canvasPortada'}).click(function(){visorPDF(archivo)}),
                 // div para la nota, le damos el mismo aspecto que las etiquetas
                 $('<div>', {'class': 'col-3 m-auto p-auto fs-5 tagDiv position-absolute top-0'}).append(
                    $('<input>', {
                        'class': 'tags',
                        'type': 'text', 
                        'size': proyecto.nota.length,
                        'disabled': true,
                        'value': proyecto.nota
                    }),
                ) // añadimos CSS para cuadrar la posicion
                .css({'cssText': 'margin-top: 1em !important'})     
                .css("padding-left", proyecto.nota === "10" ? "2px" : "8px") // cuadramos el valor de la nota en el div segun si tiene 1 dígito o 2    
                .css("width", "35px")               
            ), 
            // datos proyecto
            $('<div>', {'class': 'col-12 col-sm-8 col-md-10'}).append(
                 // nombre - alumno - curso
                 $('<div>', {'class': 'row mt-1'}).append(   
                    $('<div>', {'class': 'col-sm-6 align-self-start text-center fw-bold text-uppercase fs-5 text-break'}).append(
                        $('<p>', {'html': proyecto.nombre})
                    ),
                    $('<div>', {'class': 'col-sm-4 align-self-start fw-semibold text-break'}).append(
                        $('<p>', {'html': proyecto.alumno})
                    ),
                    $('<div>', {'class': 'col-sm-2 text-end fw-semibold d-none d-md-block'}).append(
                        $('<p>', {'html': proyecto.curso})
                    )
                ),
                // descripcion - ciclo
                $('<div>', {'class': 'row'}).append(   
                    $('<div>', {'class': 'col-md-10 align-self-start fw-light textAreaCss', 'style': 'text-break'}).append(
                        $('<p>', {'html': proyecto.descripcion})
                    ),
                    $('<div>', {'class': 'col-md-2 text-end align-self-start fw-semibold d-none d-md-block'}).append(
                        $('<p>', {'html': proyecto.ciclo})
                    )                    
                ),
                // etiquetas - editar/descargar proyecto
                $('<div>', {'class': 'row mb-1'}).append(
                    $('<div>', {'class': 'col-3 col-sm-9 ps-5 pe-4 d-none d-md-block'}).append(
                        $('<div>', {'class': 'row'}).append(
                            divEtiquetas
                        )
                    ),
                    $('<div>', {'class': 'col-9 col-sm-3 d-flex align-items-end justify-content-end p-2'}).append(
                        $('<div>', {'class': 'col-2 col-sm-6'}).append(
                            $('<button>', {'class': 'btn btn-light editarProyecto', 'html': 'Editar'}).click(function(){editarProyecto(proyecto.id)})
                        ),
                        $('<div>', {'class': 'col-6'}).append(
                            $('<a>', {'class': 'btn btn-light ms-2 descargarProyecto', 'download': proyecto.archivo_PDF, 'html': 'Descargar', 'href': '../assets/archivos/' + proyecto.archivo_PDF})
                        )
                        
                        
                    )
                )
            ), 
        )
    );    

    // devolvemos la linea de resultado completa
    return (resultado);
}







/***
 * CARGAR TODOS LOS RESULTADOS DE LA BUSQUEDA
 * funcion simple para añadir al div principal todos los resultados
 */
 function buscadorMostrarResultados(arrayProyectos) {
    // listamos los resultados de la búsqueda
    arrayProyectos.forEach(proyecto => {            
        $("#resultados").append(lineaResultado(proyecto));  
        
    });
}











/****
 * FORMULARIO EDICION PROYECTOS
 * funcion que viene de activar la funcion de editar proyectos
 * crea el formulario con los datos actuales del proyecto a editar 
 */
function  formularioEditarProyecto(data) {
    // CREACION DE SELECTS PARA FECHAS, CURSOS Y NOTAS
    // options para fechas, cursos y notas
    const optionsAnio = [];        
    anio.forEach(option => {            
        if (option===data.curso){
            optionsAnio.push("<option selected value='" + option + "'>" + option + "</option>");
        } else {
            optionsAnio.push("<option value='" + option + "'>" + option + "</option>");
        }
    });
    const optionsCiclo = [];        
    ciclo.forEach(option => {            
        if (option===data.ciclo){
            optionsCiclo.push("<option selected value='" + option + "'>" + option + "</option>");
        } else {
            optionsCiclo.push("<option value='" + option + "'>" + option + "</option>");
        }
    });
    const optionsNota = [];  
    for (let index = 0; index <= 10; index++) {
        if (index===parseInt(data.nota)){
            optionsNota.push("<option selected value='" + index + "'>" + index + "</option>");
        } else {
            optionsNota.push("<option value='" + index + "'>" + index + "</option>");
        }        
    }      
    

    // ETIQUETAS
    const editEtiquetas = data.etiquetas.split(" ");
    const divEtiquetas = []
    editEtiquetas.forEach(etiqueta => {
        // creamos las etiquetas con sus atributos
        const divEtiqueta = $("<div>", {
            'class': 'col-auto m-auto tagDiv'
        });
        const inputEtiqueta = $("<input>", {
            'class': 'tags',
            'type': 'text', 
            'size': etiqueta.length,
            'disabled': true,
            'value': etiqueta                        
        });
        const inputEliminarEtiqueta = $("<input>", {
            'class': 'tagsX',
            'type': 'submit', 
            'name': etiqueta,
            'value':'X'                        
        });
        // añadimos la funcion para autoeliminarse
        inputEliminarEtiqueta.click(function(){
            this.closest('div').remove();
            editEtiquetas.splice(editEtiquetas.indexOf(etiqueta), 1);
        });
        // añadimos las etiquetas al div correspondiente
        divEtiqueta.append(inputEtiqueta);
        divEtiqueta.append(inputEliminarEtiqueta);
        // metemos el div en el array de divs
        divEtiquetas.push(divEtiqueta)        
    });      

    // CREACION DE FORMULARIO DE EDICION HTML
    console.log(data)                     
    const formularioProyecto = $('<div>', {'class': 'col', 'id': 'proy_edit_'+data.id}).append(
        // nombre - alumno - ciclo
        $('<div>', {'class': 'row mt-3 mb-3'}).append(
            $('<div>', {'class': 'col-5'}).append(
                $('<input>', {'class': 'form-control editarNombre text-break', 'id': 'proy_edit_nombre_'+data.id, 'type': 'text', 'value': data.nombre, 'maxlength': '256'})
            ),
            $('<div>', {'class': 'col-5'}).append(
                $('<input>', {'class': 'form-control editarAlumn text-break', 'id': 'proy_edit_alumno_'+data.id, 'type': 'text', 'value': data.alumno, 'maxlength': '256'})
            ),
            $('<div>', {'class': 'col-2'}).append(
                $('<select>', {'class': 'form-select text-end editarAnio', 'id': 'proy_edit_anio_'+data.id}).append(
                    optionsAnio
                )
            )            
        ),
        // descripcion - curso        
        $('<div>', {'class': 'row mb-3'}).append(
            $('<div>', {'class': 'col-10'}).append(
                $('<textarea>', {'class': 'form-control flex-grow-1 editarDescripcion text-break', 'style': 'min-height:6em', 'id': 'proy_edit_descripcion_'+data.id, 'html': data.descripcion, 'maxlength': '1000'})
            ),
            $('<div>', {'class': 'col-2'}).append(
                $('<div>', {'class': 'col-12'}).append(
                    $('<select>', {'class': 'form-select text-end editarCiclo', 'id': 'proy_edit_ciclo_'+data.id}).append(
                        optionsCiclo
                    )
                ),            
                $('<div>', {'class': 'col-12'}).append(
                    $('<select>', {'class': 'form-select text-end editarNota mt-2', 'id': 'proy_edit_nota_'+data.id}).append(
                        optionsNota
                    )
                )            
            )
        ),
        // añadir etiquetas
        $('<div>', {'class': 'row align-items-center'}).append(
            $('<div>', {'class': 'col-4 pe-0 me-0'}).append(
                $('<input>', {'class': 'form-control editarEtiqueta ', 'list':'datalistEtiquetas'+data.id, 'id': 'proy_val_etiqueta_'+data.id, 'type': 'text', 'placeholder': 'Etiqueta...', 'maxlength': '50'}).keyup(function(){this.value=sinEspacios(this.value)}).focus(()=>{datalistOptionsEditar(data.id)}).append(
                    $('<datalist>', {'id': 'datalistEtiquetas'+data.id})
                )
            ),
            $('<div>', {'class': 'col-auto p-0'}).append(                
                //$('<button>', {'class': 'btn btn-light btnEditarEtiqueta', 'html': '+'}).click(function(){editarAniadirEtiquetas(data.id, editEtiquetas)})                    
                $('<button>', {'class': 'btn btn-light btnEditarEtiqueta'}).click(function(){editarAniadirEtiquetas(data.id, editEtiquetas)}).append(
                    $('#svgPlus').clone()
                )
                
            )                
        ),
        // quitar etiquetas
        $('<div>', {'class': 'row mb-3 mt-3 listaEditarEtiquetas', 'id': 'proy_edit_listaEtiquetas_'+data.id,}).append(
            divEtiquetas
        ),
        //  subir pdf - guardar cambios - volver - eliminar proyecto
        $('<div>', {'class': 'row mb-3 justify-content-between'}).append(
            $('<div>', {'class': 'col-2'}).append(
                $('<button>', {'class': 'btn btn-light editarArchivo', 'html': 'Reemplazar PDF'}).click(function(){$(this).parent().children('input')[0].click()}),
                $('<input>', {'id': 'proy_edit_archivo_'+data.id, 'type': 'file', 'accept': 'application/pdf', 'hidden': true}).change(function(){comprobarPDF(this, data.id)}),                
            ), 
            $('<div>', {'class': 'col-7 text-center align-self-center'}).append(
                $('<span>', {'id': 'proy_edit_span_'+data.id})
            ),
            $('<div>', {'class': 'col-3 text-end g-0'}).append(                
                $('<button>', {'class': 'btn btn-light btnGuardarEditar', 'html': 'Guardar'}).click(function(){confirmarEditar(data.id, data.archivo_PDF)}),                
                $('<button>', {'class': 'btn btn-light btnNoGuardar', 'id': 'btnCancelar'+data.id, 'html': 'Cancelar'}).click(function(){finEditar(data.id)}),
                $('<button>', {'class': 'btn btn-light btnEliminar', 'id': 'bntEliminar'+data.id, 'html': 'Eliminar'}).click(function(){confirmarEliminar(data.nombre, data.id)}),                
            ),            
        )
    );
        
    // devolvemos el formulario completo
    return formularioProyecto;
}









/**
 * AÑADIR ETIQUETAS EN EL BUSCADOR
 * obtenemos el valor de la etiqueta, lo procesamos y lo añadimos como HTML
 * pasamos el array de las etiquetas, su valor y el div principal que tiene la lista
 */
// procesamos el valor de la etiqueta
function buscadorAniadirEtiquetas(etiqueta) {    
    // guardar datos               
    const valorEtiqueta = procesarCadena(etiqueta);    
    aniadirEtiquetas(etiquetas, valorEtiqueta, $("#listaEtiquetas"));
    // limpiamos el input de etiquetas
    $("#busquedaEtiqueta").val("");
}
// añadimos la etiqueta
function aniadirEtiquetas(arrayEtiquetas, valorEtiqueta, divEtiquetas) { 
    let noAniadir = false;  
    // comprobamos si la etiqueta existe o esta vacia
    if(!valorEtiqueta) {
        noAniadir = true;
    }
    arrayEtiquetas.forEach(etiqueta => {
        if (valorEtiqueta===etiqueta) {
            noAniadir = true;
        }
    })   
    // si no esta vacia ni existe la añadimos
    if (noAniadir) {
        // no hacer nada
    } else {
        // guardar datos              
        const inputEliminar = $('<input>', {
            'class': 'tagsX',
            'type': 'submit', 
            'name': valorEtiqueta,
            'value':'X'                 
        })
        const nuevaEtiqueta = $('<div>', {'class': 'col-auto m-auto tagDiv'}).append(
            $('<input>', {
                'class': 'tags',
                'type': 'text', 
                'size': valorEtiqueta.length,
                'disabled': true,
                'value': valorEtiqueta
            }),
            inputEliminar
        )
        arrayEtiquetas.push(valorEtiqueta);
        divEtiquetas.append(nuevaEtiqueta);
        // añadimos a la etiqueta la opcion de eliminarla del html y del array de etiquetas       
        $(inputEliminar).click(function(){
                this.closest('div').remove();
                arrayEtiquetas.splice(etiquetas.indexOf(valorEtiqueta), 1);
            });   
    } 
}
/**
 * AÑADIR ETIQUETAS EN EL EDITOR
 * obtenemos el valor de la etiqueta y la añadimos a la lista de etiquetas del editor
 * usamos misma funcion para añadir las etiquetas que en el buscador 
 */
// añadir etiquetas al editor de proyecto
function editarAniadirEtiquetas(id, editEtiquetas){
    // guardar datos  
    const listaEtiquetas = $('#proy_edit_'+id).children('.listaEditarEtiquetas');
    const inputEtiqueta = $('#proy_val_etiqueta_'+id);    
    const valorEtiqueta = procesarCadena($(inputEtiqueta).val());
    // procesamos la etiqueta
    aniadirEtiquetas(editEtiquetas, valorEtiqueta, $(listaEtiquetas));
    // limpiamos el input de etiquetas
    $(inputEtiqueta).val("");
}















/***
 * EDITOR DE DATOS DE PROYECTO
 * obtenemos todos los datos del formulario de edicion y los procesamos
 * confimamos que los datos sean correctos y lanzamos modal de confirmación
 * si se acepta, se modifican los datos
 */
function confirmarEditar(id, archivoOriginal) {
    // valores     
    const nombre = $('#proy_edit_nombre_'+id).val();
    const alumno = $('#proy_edit_alumno_'+id).val();
    const descripcion = $('#proy_edit_descripcion_'+id).val();
    const archivo = $('#proy_edit_archivo_'+id)[0].files[0];
    const arrayEtiquetas = $('#proy_edit_listaEtiquetas_'+id).children().children("input[type='text']").toArray();
    const valorEtiquetas = [];    
    arrayEtiquetas.forEach(child => {
        valorEtiquetas.push(child.value)
    })       
    const span = $('#proy_edit_span_'+id);    
    const formData = new FormData();

    // comprobamos valores, devolvemos error de no ser correctos
    if (nombre === "") {
        $(span).html('El nombre del proyecto no puede estar vacío');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }
    if (alumno === "") {
        $(span).html('El nombre del alumno no puede estar vacío');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }
    if (descripcion === "" || descripcion.length>1000) {
        $(span).html('Tienes que poner una descripción');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    } 
    
    // añadimos todos los datos al formData    
    formData.append('id', id);
    formData.append('nombre', $('#proy_edit_nombre_'+id).val());
    formData.append('alumno', $('#proy_edit_alumno_'+id).val());
    formData.append('curso', $('#proy_edit_anio_'+id).val());
    formData.append('ciclo', $('#proy_edit_ciclo_'+id).val());
    formData.append('nota', $('#proy_edit_nota_'+id).val());
    formData.append('descripcion', $('#proy_edit_descripcion_'+id).val());
    formData.append('etiquetas', valorEtiquetas.join(" "));
    // archivo
    if (archivo) {
        formData.append('archivo', archivo);        
        formData.append('archivoOriginal', archivoOriginal);
    }      
    // modal de confirmación para editar
    $('#modal').empty();
    $('#modal').append(
        $('<div>', {'class': 'modal fade', 'id': 'proy_modal_confirm', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
            $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                $('<div>', {'class': 'modal-content'}).append(
                    $('<div>', {'class': 'modal-header'}).append(
                        $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Modificar Proyecto'})                                
                    ),
                    $('<div>', {'class': 'modal-body'}).append(
                        $('<p>', {'html': 'Vas a modificar el proyecto actual, ¿estas seguro?'})
                    ),
                    $('<div>', {'class': 'modal-footer'}).append(
                        $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#proy_modal_confirm').modal('hide')}),
                        $('<button>', {'class': 'btn btn-success', 'type' : 'button', 'html': 'Modificar'}).click(function(){                                                                       
                            $('#proy_modal_confirm').modal('hide');
                            // pasamos todos los datos a la funcion de consulta a la BBDDD
                            editarBBDDProyecto(formData, id)
                        })
                    )
                )
            )
        )
    ),
    // lanzamos el modal
    $('#proy_modal_confirm').modal('show');
}
// edicion de la BBDD
function editarBBDDProyecto(datosFormdata, id) {
    const cancelButton = $('#btnCancelar'+id);
    const span = $('#proy_edit_span_'+id); 
    // enviamos el formdata al archivo php que lo va a procesar
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/actualizarProyecto.php",
        data: datosFormdata,
        dataType: "json",
        processData: false,  
        contentType: false,
        // mientras esperamos la respuesta...
        beforeSend: ()=> {
            $(span).removeAttr("class");
            $(span).html('Guardando...');
            $(span).addClass('text-success');
            $(span).addClass('guardando');            
        }     
    }) // manejo del resultado de la petición
    .done(function(data) {
        // manejamos la respuesta
        $(span).removeAttr("class");
        $(span).html('Los nuevos datos se han guardado correctamente');        
        $(span).addClass('text-success');
        $(cancelButton).html('Volver');
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
        $(span).removeAttr("class");
        $(span).html('Ha habido un error, intentalo de nuevo mas tarde');        
        $(span).addClass('text-danger');        
    }) 
}








/***
 * COMPROBACION PDF
 * obetenemos el pdf que se va a subir para remplazar el original
 * nos aseguramos de que sea un archivo valido
 */
function comprobarPDF(elemento, id) {
    const soloPDF =/(\.pdf)$/i;
    const span = $('#proy_edit_span_'+id);    
    if (elemento.value.length) {
        if (!soloPDF.exec(elemento.files[0].name)) {
            $(elemento).val('');
            $(span).html('Solo se permiten archivos PDF') 
            $(span).removeAttr("class");
            $(span).addClass('text-warning');   
        } else {
            $(span).html('PDF: ' + elemento.files[0].name)
            $(span).removeAttr("class");
            $(span).addClass('text-body');   
        }
    } else {
        $(span).html('No has seleccionado ningun archivo')
        $(span).removeAttr("class");
        $(span).addClass('text-warning');
    }
}






/***
 * CANCELAR EDITAR
 * al cancelar el formulario de edicion lo eliminamos 
 * y cargamos de nuevo el div del proyecto con los datos que contenga
 */
function finEditar(id) {    
    // guardamos en div principal 
    const div = $('#proy_'+id);  
    
    // limpiamos la caja del formulario    
    div.empty();    

    // obtenemos el proyecto con los datos actuales    
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listarProyectoID.php",
        data: {id: id},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {
        // creamos el div con los datos
        const nuevoDiv =lineaResultado(data);        
    
        // mostramos los datos
        $(div).parent().replaceWith(nuevoDiv);
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     
}







/***
 * ELIMINAR PROYECTO
 * pedimos confirmación mediante modal
 * si todo es correcto, eliminamos el proyecto de la base de datos
 * volvemos a cargar el buscador con el criterio de busqueda previamente establecido
 */
function confirmarEliminar(nombre, id) {
    // limpiamos lo que haya en el modal
    $('#modal').empty();
    // creamos el modal nuevo
    $('#modal').append(
        // modal de confirmacion para eliminar
        $('<div>', {'class': 'modal fade', 'id': 'proy_modal_eliminar', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
            $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                $('<div>', {'class': 'modal-content'}).append(
                    $('<div>', {'class': 'modal-header'}).append(
                        $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Eliminar Proyecto'})                                
                    ),
                    $('<div>', {'class': 'modal-body'}).append(
                        $('<p>', {'html': '¿Seguro que quieres eliminar el proyecto?'})
                    ),
                    $('<div>', {'class': 'modal-footer'}).append(
                        $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#proy_modal_eliminar').modal('hide')}),
                        $('<button>', {'class': 'btn btn-danger', 'type' : 'button', 'html': 'Eliminar'}).click(function(){                                    
                            $('#proy_modal_eliminar').modal('hide')
                            // si confirmamos el modal, se lanza la eliminacion de la bbdd
                            eliminarProyecto(nombre, id)
                        })
                    )
                )
            )
        )
    )
     // lanzamos el modal
     $('#proy_modal_eliminar').modal('show');
}
function eliminarProyecto(nombre, id) {
    const span = $('#proy_edit_span_'+id); 
    console.log(id)
    // lanzamos peticion de eliminación de proyecto
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/eliminarProyecto.php",
        data: {id: id},
        dataType: "json",
        // mientras esperamos la respuesta...
        beforeSend: ()=> {
            $(span).removeAttr("class");
            $(span).html('Eliminando...');
            $(span).addClass('text-danger');
            $(span).addClass('eliminando');            
        }     
    }) // manejo del resultado de la petición
    .done(function(data) {
        // manejamos la respuesta        
        // si hay respuesta positiva cargamos de nuevo los resultados de la busqueda, pasando el nombre del archivo eliminado
        if (data) {
            mostrar(nombre);    
        } else {        
        // en caso contario mostramos error
            $(span).removeAttr("class");
            $(span).html('Ha habido un error, intentalo de nuevo mas tarde');        
            $(span).addClass('text-danger');        
        }
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
        $(span).removeAttr("class");
        $(span).html('Ha habido un error, intentalo de nuevo mas tarde');        
        $(span).addClass('text-danger');        
    }) 

    
        
    
    
    


    
    
    
                    
}






/****
 * PROCESAR CADENAS / INPUTS
 * procesamos el texto de las etiquetas para que todas sean iguales 
 * y no haya la misma con acentos, mayusculas, etc
 * eliminamos los espacios del imput para que no se puedan introducir
 */
function procesarCadena(cadena) {
    const cad = cadena.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")    
    return cad;
}
// no permitir espacios en el input de etiquetas
function sinEspacios(textoEtiqueta){
    // dividomos el texto en caracteres
    const texto = textoEtiqueta.split("");
    // quitamos el ultimo y si es un espacio devolvemos el texto sin el
    if (texto.pop()===" ") {
        return texto.join("");
    }
    // en caso contrario debvolvemos el texto original
    return textoEtiqueta;
}












/***
 * CREACION DE LOS SELECT HTML PARA CICLOS Y CURSOS
 */
function selectCiclos(){
    const optionsCiclo = [];     
    optionsCiclo.push("<option selected value=''>Ciclo - Todos</option>");
    ciclo.forEach(option => {            
        optionsCiclo.push("<option value='" + option + "'>" + option + "</option>");
    })    
    $('#busquedaCiclo').append(optionsCiclo);
    $('#busquedaCiclo').change(()=>{nubeEtiquetas();datalistOptions()});    
}
selectCiclos();
function selectCursos(){    
    const optionsAnio = [];        
    optionsAnio.push("<option selected value=''>Año - Todos</option>");
    anio.forEach(option => {                    
        optionsAnio.push("<option value='" + option + "'>" + option + "</option>");
    })
    $('#busquedaCurso').append(optionsAnio);
}
selectCursos();









/***
 * CREACION DEL VISOR PDF
 * 
 */
function visorPDF(archivo) {
    var pdf = null;
    let nPag = 1;
    let pageRendering = false;
    let pageNumPending = null;    
    // archivo worker para pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../assets/librerias/pdf.worker.js';
    // carga incial del PDF
    pdfjsLib.getDocument(archivo).promise.then(function(pdfDoc_) {
        pdf = pdfDoc_;                
        renderizarPagina(nPag);        
    });        
    
    // cargamos el modal que contendra el visor
    $('#modal').empty();
    $('#modal').append(
        $('<div>', {'class': 'modal fade', 'id': 'modalVisor', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
            $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                $('<div>', {'class': 'modal-content'}).append(
                    $('<div>', {'class': 'modal-header justify-content-between'}).append(
                        $('<nav>', {'aria-label':"Page navigation example"}).append(
                            $('<ul>',{'class':'pagination'}).append(                                
                                $('<li>',{'class':"page-item"}).append(    
                                    $('<button>', {'class':"page-link border-0", 'html':'X'}).click(function(){$('#modalVisor').modal('hide')})                        
                                )
                            )
                        ),
                        $('<nav>', {'aria-label':"Page navigation example"}).append(
                            $('<ul>',{'class':'pagination'}).append(                                
                                $('<li>',{'class':"page-item"}).append(                                    
                                    $('<button>', {'class':"page-link", 'html':'&laquo', 'aria-label':"Previous"}).click(function(){                                            
                                        if (nPag <= 1) {
                                            return;
                                            }
                                            nPag--;                                   
                                            queueRenderPage(nPag);
                                    })                                    
                                ),  
                                $('<li>',{'class':"page-item"}).append( 
                                    $('<button>', {'class':"page-link", 'html':'&raquo', 'aria-label':"Next"}).click(function(){
                                        if (nPag >= pdf.numPages) {
                                            return;
                                            }
                                            nPag++;                                                                    
                                            queueRenderPage(nPag);    
                                    })                                    
                                )
                            )
                        )
                    ),
                    $('<div>', {'class': 'modal-body'}).append(
                        $('<canvas>', {'id': 'canvasVisor'})
                    ),
                    $('<div>', {'class': 'modal-footer'}).append(
                        $('<nav>', {'aria-label':"Page navigation example"}).append(
                            $('<ul>',{'class':'pagination'}).append(                                
                                $('<li>',{'class':"page-item"}).append(    
                                    $('<button>', {'class':"page-link", 'html':'Cerrar', 'aria-label':"Cerrar"}).click(function(){$('#modalVisor').modal('hide')})                        
                                )
                            )
                        ),
                    )                    
                )
            )
        )
    )
    // lanzamos el modal
    $('#modalVisor').modal('show');
    
    // renderizado de las paginas
    function renderizarPagina(pagina) {        
        pageRendering = true;
        // cargamos la pagina
        pdf.getPage(pagina).then(function(page) {
            // obtenemos el canvas y le damos las dimensiones que tiene que tener (escalando el tamaño del pfg)
            const canvas = $('#canvasVisor')[0];               
            const viewport = screen.width > 576 ? page.getViewport({scale: 1}) : page.getViewport({scale: 0.5});
            console.log(screen.width)
            const ctx = canvas.getContext('2d');          
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height =  Math.floor(viewport.height) + "px";

            $('.modal-content').width(screen.width)
            
            // renderizamos el pdf en el canvas
            const rend = page.render({
                canvasContext: ctx,                
                viewport: viewport
            })           
            rend.promise.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // control del renderizado
                    renderizarPagina(pageNumPending);
                    pageNumPending = null;
                } 
            });
        });                                
    }

    // cola para el renderizado
    function queueRenderPage(num) {
        if (pageRendering) {
          pageNumPending = num;
        } else {
            renderizarPagina(num);
        }
      }
}

















/***
 * NUBE DE ETIQUETAS
 */
function nubeEtiquetas(){        
    // obtenemos la lista de etiquetas mediante peticion
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/nubeEtiquetas.php",
        data: {curso:$('#busquedaCiclo').val()},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        // juntamos todas las etiquetas 
        const listaEtiquetas = [];        
        data.forEach(element => {
            listaEtiquetas.push(element.etiquetas)
        });
        // dividimos en palabras
        const arrEtiquetas = listaEtiquetas.join(" ").split(" ");
        // creamos los datos finales para la nube de etiquetas
        const nubeEtiquetas = [];                
        arrEtiquetas.forEach(etiqueta => {nubeEtiquetas[etiqueta] = nubeEtiquetas[etiqueta] + 1 || 1}); 
        const jqwcloud = [];        
        
        // JQWCLOUD - https://www.jqueryscript.net/text/Word-Tag-Cloud-Generator-jQWCloud.html#google_vignette
        // añadimos las palabras con su peso al array del cloud
        for (const key in nubeEtiquetas) {
            // por algun motivo que no entiendo esta recorriendo una funcion como si fuese una key (shuffle) y la añade, con esto nos aseguramos de que el valor sera un numero y solo un numero (shuffle no es un numero)
            if (typeof nubeEtiquetas[key] === 'number'){
                jqwcloud.push({word: key, weight: nubeEtiquetas[key]})
            }
        }
        // odenamos el array de datos de mayor a menor
        jqwcloud.sort((a, b)=> b.weight - a.weight)
        // lanzamos el cloud
        $('#nubeEtiquetas').jQWCloud({
            // pasamos las palabras con su peso, cargando solo las 15 primeras
            words: jqwcloud.slice(0,15),
            // configuracion de la nube
            // title
            title: 'JQ WOrd Cloud',
            // min/max font size
            minFont: 10,
            maxFont: 50,
            // font offset
            fontOffset: 0,
            // shows the algorithm of creating the word cloud
            showSpaceDIV: false,
            // Enables the vertical alignment of words
            verticalEnabled: true,
            // color
            cloud_color: null,
            // font family
            cloud_font_family: null,
            // color of covering divs
            spaceDIVColor: 'white',
            // left padding of words
            padding_left: null,
            // classes with space to be applied on each word
            word_common_classes: null,
            // configuracion de eventos
            // añadimos el envento que añade el tag
            word_click : function(){aniadirEtiquetas(etiquetas, this.textContent, $("#listaEtiquetas"))},
            // añadimos una clase para darle css cuando se pasa el raton por encima
            word_mouseOver : function(){$(this).addClass('tagsNube')},
            word_mouseEnter : function(){},
            // quitamos la clase al sacar el raton de la palabra
            word_mouseOut : function(){$(this).removeClass('tagsNube')},
            beforeCloudRender: function(){},
            afterCloudRender: function(){}
        })   
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     
}
nubeEtiquetas();








/***
 * DATALIST
 * a la hora de añadir etiquetas usaremos un datalist y como opciones las etiquetas que ya existen
 */
function datalistOptions() {
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/nubeEtiquetas.php",
        data: {curso:$('#busquedaCiclo').val()},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        // juntamos todas las etiquetas         
        const listaEtiquetas = [];        
        data.forEach(element => {
            listaEtiquetas.push(element.etiquetas)
        });        
        // dividimos el array en palabras y filtramos para que no se repitan los elementos
        const arrEtiquetas = listaEtiquetas.join(" ").split(" ").filter((x, i, a) => a.indexOf(x) == i);
        // eliminamos opciones si las hay y añadimos las opciones al datalist      
        $('#datalistEtiquetas').empty();
        arrEtiquetas.forEach(etiqueta => {            
            $('#datalistEtiquetas').append(
                $('<option>', {'value': etiqueta})
            )
        });
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     
}
datalistOptions();
/**
 * Datalist para el formulario de edicion de proyectos
 */
function datalistOptionsEditar(id) {
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/nubeEtiquetas.php",
        data: {curso:$('#proy_edit_ciclo_'+id).val()},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        // juntamos todas las etiquetas       
        const listaEtiquetas = [];        
        data.forEach(element => {
            listaEtiquetas.push(element.etiquetas)
        });        
        // dividimos el array en palabras y filtramos para que no se repitan los elementos
        const arrEtiquetas = listaEtiquetas.join(" ").split(" ").filter((x, i, a) => a.indexOf(x) == i);
        // eliminamos opciones si las hay y añadimos las opciones al datalist      
        $('#datalistEtiquetas'+id).empty();
        arrEtiquetas.forEach(etiqueta => {            
            $('#datalistEtiquetas'+id).append(
                $('<option>', {'value': etiqueta})
            )
        });        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     
}














/***
*   FUNCION DE LOGOUT
*/
function logout(){
    window.location.href = "../index.php";
}






