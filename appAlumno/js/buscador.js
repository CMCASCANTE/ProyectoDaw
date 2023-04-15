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
        } else {
            console.log("asdasd")
            if (numRows == 0) {
                $('#paginacion').append(
                    $('<div>', {'class': 'col-md-8 paginado'}).append(
                        $('<span>', {'class': 'text-danger', 'html': 'No se han encontrado resultados...'}).append(         

                        )
                    )
                ) 
            }  
        }  

        // listamos los primeros 5 resultados de la búsqueda
        resultPag(nombre, ciclo, curso, valorEtiquetas, 0, 5)
            
        
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
                $('<canvas>', {'id': 'canvas_'+proyecto.id, 'class': 'canvasPortada'}).click(function(){visorPDF(archivo)})
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
                    $('<div>', {'class': 'col-9 ps-5 pe-4 d-none d-md-block'}).append(
                        $('<div>', {'class': 'row'}).append(
                            divEtiquetas
                        )
                    )
                )
            ), 
        )
    );    
    
    // añadimos la opción de descarga segun el valor del permiso en la BBDD
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/permisoDescarga.php",        
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        
        // elementos para el switch on/off según el valor actual del permiso
        if (data.valor === '1') {
            $($($(resultado).children().children()[1]).children()[2]).append(
                $('<div>', {'class': 'col-3 d-flex align-items-end justify-content-end p-2'}).append(                        
                    $('<a>', {'class': 'btn btn-light ms-2 descargarProyecto', 'download': proyecto.archivo_PDF, 'html': 'Descargar', 'href': '../assets/archivos/' + proyecto.archivo_PDF})
                )
            )
        } 

    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     

    // añadimos la opción de ver la Nota segun el valor del permiso en la BBDD
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/permisoNotas.php",        
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        
        // elementos para el switch on/off según el valor actual del permiso    
        if (data.valor === '1') {   
            $($($(resultado).children().children()[0])).append(
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
            )
        } 

    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     

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












/***
*   FUNCION DE LOGOUT
*/
function logout(){
    window.location.href = "../index.php";
}






