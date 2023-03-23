/*
* JS para la página del nuevo proyecto
*/

// datos de uso general
const etiquetas = [];







/***
 * AÑADIR PROYECTO
 * obtenemos todos los datos del formulario y los procesamos
 * confimamos que los datos sean correctos y lanzamos modal de confirmación
 * si se acepta, se modifican los datos
 */
function confirmarAniadir() {
    // valores     
    const nombre = $('#nombre').val();
    const alumno = $('#alumno').val();
    const curso = $('#busquedaCurso').val();
    const ciclo = $('#busquedaCiclo').val();
    const descripcion = $('#descripcion').val();
    const archivo = $('#subirArchivo')[0].files[0];
    const arrayEtiquetas = $('#listaEtiquetas').children().children("input[type='text']").toArray();
    const valorEtiquetas = [];    
    arrayEtiquetas.forEach(child => {
        valorEtiquetas.push(child.value)
    })       
    const span = $('#nuevoProyAdvises');    
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
    if (ciclo === "") {
        $(span).html('Tienes que seleccionar un ciclo');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }
    if (curso === "") {
        $(span).html('Tienes que seleccionar un curso');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }        
    if (descripcion === "" || descripcion.length>1000) {
        $(span).html('Tienes que poner una descripción(máximo 1000 caracteres)');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    } 
    // archivo
    if (archivo) {
        formData.append('archivo', archivo);                
    } else {
        $(span).html('Tienes que seleccionar un archivo PDF');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }     
    
    // añadimos todos los datos al formData        
    formData.append('nombre', nombre);
    formData.append('alumno', alumno);
    formData.append('curso', curso);
    formData.append('ciclo', ciclo);
    formData.append('descripcion', descripcion);
    formData.append('etiquetas', valorEtiquetas.join(" "));
    
    // modal de confirmación para editar
    $('#modal').empty();
    $('#modal').append(
        $('<div>', {'class': 'modal fade', 'id': 'proy_modal_confirm', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
            $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                $('<div>', {'class': 'modal-content'}).append(
                    $('<div>', {'class': 'modal-header'}).append(
                        $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Nuevo Proyecto'})                                
                    ),
                    $('<div>', {'class': 'modal-body'}).append(
                        $('<p>', {'html': 'Vas a añadir el proyecto: ' + nombre + ', ¿estas seguro?'})
                    ),
                    $('<div>', {'class': 'modal-footer'}).append(
                        $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#proy_modal_confirm').modal('hide')}),
                        $('<button>', {'class': 'btn btn-success', 'type' : 'button', 'html': 'Añadir'}).click(function(){                                                                       
                            $('#proy_modal_confirm').modal('hide');
                            // pasamos todos los datos a la funcion de consulta a la BBDDD
                            aniadirBBDDProyecto(formData)
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
function aniadirBBDDProyecto(datosFormdata) {    
    const span = $('#nuevoProyAdvises'); 
    // enviamos el formdata al archivo php que lo va a procesar
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/aniadirProyecto.php",
        data: datosFormdata,
        dataType: "json",
        processData: false,  
        contentType: false,
        // mientras esperamos la respuesta...
        beforeSend: ()=> {
            $(span).removeAttr("class");
            $(span).html('Añadiendo...');
            $(span).addClass('text-success');
            $(span).addClass('guardando');            
        }     
    }) // manejo del resultado de la petición
    .done(function(data) {
        // manejamos la respuesta
        if (data) {            
            $(span).removeAttr("class");
            $(span).html('Los nuevos datos se han añadido correctamente');        
            $(span).addClass('text-success');  
            $('#nombre').val('');
            $('#alumno').val('');
            $('#busquedaCiclo').val('');
            $('#descripcion').val('');
            $('#busquedaCurso').val('');
            $('#listaEtiquetas').empty();    
            etiquetas.length = 0;        
                 
        } else {
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












/**
 *  BOTON SUBIR UN PDF
 */
function subirPDF(){
    $('#subirArchivo').click();
    $('#subirArchivo').change(function(){comprobarPDF(this)});
}
/***
 * COMPROBACION PDF
 * obetenemos el pdf que se va a subir para remplazar el original
 * nos aseguramos de que sea un archivo valido
 */
function comprobarPDF(elemento) {
    const soloPDF =/(\.pdf)$/i;
    const span = $('#nuevoProyAdvises');    
    if (elemento.value.length) {
        if (!soloPDF.exec(elemento.files[0].name)) {
            $(elemento).val('');
            $(span).html('Solo se permiten archivos PDF') 
            $(span).removeAttr("class");
            $(span).addClass('text-danger');   
        } else {
            $(span).html('PDF: ' + elemento.files[0].name)
            $(span).removeAttr("class");
            $(span).addClass('text-body');   
        }
    } else {
        $(span).html('No has seleccionado ningun archivo')
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
    }
}



















/***
 * CREACION DE LOS SELECT HTML PARA CICLOS Y CURSOS
 */
function selectCiclos(){
    const optionsCiclo = [];         
    optionsCiclo.push("<option selected value=''>Ciclo...</option>");
    ciclo.forEach(option => {            
        optionsCiclo.push("<option value='" + option + "'>" + option + "</option>");
    })    
    $('#busquedaCiclo').append(optionsCiclo);
    $('#busquedaCiclo').change(()=>{datalistOptions()});    
}
selectCiclos();
function selectCursos(){    
    const optionsAnio = [];            
    optionsAnio.push("<option selected value=''>Curso...</option>");
    anio.forEach(option => {                    
        optionsAnio.push("<option value='" + option + "'>" + option + "</option>");
    })
    $('#busquedaCurso').append(optionsAnio);
}
selectCursos();





















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
 * FUNCION DE BOTON VOLVER
 */
function volver(){
    location.href = './buscador.php';
}







/***
*   FUNCION DE LOGOUT
*/
function logout(){
    window.location.href = "../index.php";
}


