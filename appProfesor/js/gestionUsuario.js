/*
* JS para la página del nuevo proyecto
*/


/**
 * Funcion principal para crear el formulario de cambio de contraseña
 */
function userData(id){
    // traemos los datos del usuario
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/datosProfesor.php",
        data: {
            id: id
        },
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        // creamos un formulario con los datos
        $('#datosUsuario').append(
            $('<div>', {'class': 'row'}).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-3'}).append(  
                    $('<label>', {'class': 'form-label', 'for': 'emailUsuario', 'html': 'Usuario'}),                  
                    $('<input>', {'class': 'form-control', 'id': 'emailUsuario', 'type': 'text', 'placeholder': data.email, 'disabled': 'true'})
                )
            ),
            $('<div>', {'class': 'row'}).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-2'}).append(
                    $('<label>', {'class': 'form-label', 'for': 'nombreUsuario', 'html': 'Nombre'}),                  
                    $('<input>', {'class': 'form-control', 'id': 'nombreUsuario', 'type': 'text', 'placeholder': data.nombre, 'disabled': 'true'})
                )
            ),
            $('<div>', {'class': 'row'}).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-2'}).append(
                    $('<label>', {'class': 'form-label', 'for': 'passUsuario', 'html': 'Modificar contraseña'}),
                ),
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4'}).append(
                    $('<input>', {'class': 'form-control', 'id': 'passUsuario', 'type': 'password', 'placeholder': 'Nueva contraseña...'})
                ),
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-2'}).append(
                    $('<input>', {'class': 'form-control', 'id': 'confPassUsuario', 'type': 'password', 'placeholder': 'Confirmar contraseña...'})
                )
            ),
            $('<div>', {'class': 'row'}).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 text-end mt-3 mb-3'}).append(
                    $('<button>', {'class': 'btn btn-light btnGuardarEditar', 'html': 'Modificar'}).click(function(){modificarDatos(data.id)}),
                    $('<button>', {'class': 'btn btn-light btnEliminar', 'html': 'Volver'}).click(function(){volver()})
                )
            ),
            $('<div>', {'class': 'row'}).append(
                $('<div>', {'class': 'col mt-3 text-center'}).append(
                    $('<span>', {'id': 'confirmarDatos'})
                )
            )
        )
  
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    })     
    
}
/**
 * Confimacion de datos
 */
function modificarDatos(id) {
    const nuevaPass = $('#passUsuario').val();
    const confPass = $('#confPassUsuario').val();
    const span = $('#confirmarDatos');
    console.log(nuevaPass)
    console.log(confPass)

    // comprobamos valores, devolvemos error de no ser correctos
    if (nuevaPass === "" || nuevaPass != confPass) {
        $(span).html('La contraseña no coindice con su confirmación');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');        
    } else {
        // modal de confirmación para editar
        $('#modal').empty();
        $('#modal').append(
            $('<div>', {'class': 'modal fade', 'id': 'user_modal_confirm', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
                $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                    $('<div>', {'class': 'modal-content'}).append(
                        $('<div>', {'class': 'modal-header'}).append(
                            $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Modificar Datos Usuario'})                                
                        ),
                        $('<div>', {'class': 'modal-body'}).append(
                            $('<p>', {'html': 'Vas a modificar los datos tu contraseña, ¿estas seguro?'})
                        ),
                        $('<div>', {'class': 'modal-footer'}).append(
                            $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#proy_modal_confirm').modal('hide')}),
                            $('<button>', {'class': 'btn btn-success', 'type' : 'button', 'html': 'Modificar'}).click(function(){                                                                       
                                $('#user_modal_confirm').modal('hide');
                                // pasamos todos los datos a la funcion de consulta a la BBDDD
                                confirmarContrasenia(nuevaPass,id)
                            })
                        )
                    )
                )
            )
        ),
        // lanzamos el modal
        $('#user_modal_confirm').modal('show');
    }
}
/**
 * Modificacion de contraseña
 */
function confirmarContrasenia(pass, id){
    const span = $('#confirmarDatos');
    // modificamos la contraseña
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/passwordProfesor.php",
        data: {
            id: id,
            password: pass
        },
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) { 
        if (data) {
            $(span).html('La contraseña se ha cambiado correctamente');
            $(span).removeAttr("class");
            $(span).addClass('text-success'); 
            $('#passUsuario').val('');
            $('#confPassUsuario').val('');
        } else {
            $(span).html('Ha habido un error, prueba de nuevo');
            $(span).removeAttr("class");
            $(span).addClass('text-danger'); 
        }
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}








/**
 * Funciones para el permiso de descarga
 */
function permisosDescarga() {
    // variable
    const div = $('#permDescarga');

    // peticion para extraer el valor actual de los permisos
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/permisoDescarga.php",        
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {        
        console.log(data.valor)
        // elementos para el switch on/off según el valor actual del permiso
        if (data.valor==='1') {            
            $(div).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-3 form-check form-switch mt-4'}).append(
                    $('<label>', {'class': 'form-check-label', 'for': 'flexSwitchCheckChecked', 'html': 'Permiso de descarga PDF'}),
                    $('<input>', {'class': 'form-check-input ms-3 me-3', 'type': 'checkbox', 'role': 'switch', 'id': 'flexSwitchCheckChecked', 'checked': 'true'}).change(function(event){permDescChange(event)})            
                )
            )
        } else {            
            $(div).append(
                $('<div>', {'class': 'col-12 col-sm-8 col-md-6 col-lg-4 offset-0 offset-sm-2 offset-md-3 offset-lg-4 mt-3 form-check form-switch mt-4'}).append(
                    $('<label>', {'class': 'form-check-label', 'for': 'flexSwitchCheckDefault', 'html': 'Permiso de descarga PDF'}),
                    $('<input>', {'class': 'form-check-input ms-3 me-3', 'type': 'checkbox', 'role': 'switch', 'id': 'flexSwitchCheckDefault'}).change(function(event){permDescChange(event)})            
                )
            )
        }

    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}

function permDescChange(event) {
    const switchValor = event.currentTarget.checked ? 1 : 0;
    console.log('asds')
    // mandamos petición para cambiar el avlor del permiso
    // modificamos la contraseña
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/permisoDescarga.php",
        data: {
            permDesc: switchValor            
        },
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) { 
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
    
}
permisosDescarga();







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


