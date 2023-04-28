/*
* JS para la página del nuevo proyecto
*/









/**
 * Formulario para añadir profesor
 */
function aniadirProfesor(){
    $('#aniadirProfesor').append(
        $('<div>', {'class': 'row m-2 text-center'}).append(
            $('<div>', {'class': 'col'}).append(
               $('<span>', {'id': 'userSpan'})
            )
        )
    )
    $('#aniadirProfesor').append(
        $('<div>', {'class': 'row justify-content-center mb-3'}).append(
            $('<div>', {'class': 'col-7 col-md-auto'}).append(
                $('<input>', {'class': 'form-control', 'id': 'newNom', 'type': 'text', 'placeholder': 'Nombre...'})
            ),
            $('<div>', {'class': 'col-7 col-md-auto'}).append(
                $('<input>', {'class': 'form-control', 'id': 'newUser', 'type': 'email', 'placeholder': 'User(email)...'})                
            ),
            $('<div>', {'class': 'col-7 col-md-auto'}).append(
                $('<input>', {'class': 'form-control', 'id': 'newPas', 'type': 'password', 'placeholder': 'Contraseña...'})
            ),
            $('<div>', {'class': 'col-7 col-md-auto text-end text-md-start'}).append(
                $('<button>', {'class': 'btn btn-light btnGuardarEditar', 'html': 'Añadir'}).click(function(){confirmarProfesor()})
            )
        )
    )    
}
aniadirProfesor();
/***
 * Confirmacion para añadir profesor
 */
function confirmarProfesor(){
    const user = $('#newUser').val();
    const nombre = $('#newNom').val();
    const pass = $('#newPas').val();
    const span = $('#userSpan');  

    // comprobamos valores, devolvemos error de no ser correctos
    if (nombre === "") {
        $(span).html('El nombre no puede estar vacío');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }
    if (user === "") {
        $(span).html('El usuario no puede estar vacío y tiene que ser un email válido');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    }    
    if (pass === "") {
        $(span).html('Tienes que poner una contraseña!!');
        $(span).removeAttr("class");
        $(span).addClass('text-danger');
        return;
    } 
    // comprobamos que el usuario no exista
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listaProfesor.php",
        data: {
            user: user,            
        },
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {   
        const span = $('#userSpan');  
        // si devuelve algo el usuario existe
        if (data) {
            $(span).removeAttr("class");
            $(span).html('El usuario ' + user + ' ya existe');            
            $(span).addClass('text-danger');            
        } else {
            // si el usuario no existe lanzamos la confirmacion
            // modal de confirmación para editar
            $('#modal').empty();
            $('#modal').append(
                $('<div>', {'class': 'modal fade', 'id': 'prof_modal_confirm', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
                    $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                        $('<div>', {'class': 'modal-content'}).append(
                            $('<div>', {'class': 'modal-header'}).append(
                                $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Añadir Usuario'})                                
                            ),
                            $('<div>', {'class': 'modal-body'}).append(
                                $('<p>', {'html': 'Vas a añadir un usuario nuevo, ¿estas seguro?'})
                            ),
                            $('<div>', {'class': 'modal-footer'}).append(
                                $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#prof_modal_confirm').modal('hide')}),
                                $('<button>', {'class': 'btn btn-success', 'type' : 'button', 'html': 'Añadir'}).click(function(){                                                                       
                                    $('#prof_modal_confirm').modal('hide');
                                    // pasamos todos los datos a la funcion de consulta a la BBDDD
                                    aniadirBBDD(user, nombre, pass)
                                })
                            )
                        )
                    )
                )
            ),
            // lanzamos el modal
            $('#prof_modal_confirm').modal('show');
        }
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
    
}
function aniadirBBDD(user, nombre, pass){             
    // añadimos el usuario a la lista de la BBDD
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/aniadirProfesor.php",
        data: {
            email: user,
            nombre: nombre,
            password: pass
        },
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {   
        const span = $('#userSpan');  
        if (data) {
            $(span).removeAttr("class");
            $(span).html('El profesor ' + nombre + ' ha sido añadido correctamente');            
            $(span).addClass('text-success');
            // limpiamos los campos
            $('#newNom').val('');
            $('#newUser').val('');
            $('#newPas').val('');
            // cagamos la lista de nuevo con los nuevos datos
            listarProfesores();
        } else {
            $(span).removeAttr("class");
            $(span).html('Ha habido un error, intentalo de nuevo mas tarde');        
            $(span).addClass('text-danger');   
        }
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}
    
















/***
 * listar profesores
 */
function listarProfesores(){
    // buscamos la lista de profesores
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/listaProfesores.php",
        data: {},
        dataType: "json"        
    }) // manejo del resultado de la petición
    .done(function(data) {   
        $('#listaProfesores').empty();        
        data.forEach(user => {
            $('#listaProfesores').append(
                $('<div>', {'class': 'row justify-content-center m-3'}).append(
                    $('<div>', {'class': 'col-7 col-sm-auto'}).append(
                        $('<input>', {'class': 'form-control', 'type': 'text', 'placeholder': user.nombre, 'disabled': 'true'})
                    ),
                    $('<div>', {'class': 'col-7 col-sm-auto'}).append(
                        $('<input>', {'class': 'form-control', 'type': 'text', 'placeholder': user.email, 'disabled': 'true'})
                    ),
                    $('<div>', {'class': 'col-7 col-sm-auto  text-end text-sm-center text-md-start'}).append(
                        $('<button>', {'class': 'btn btn-light btnEliminar', 'html': 'Eliminar'}).click(function(){eliminar(user.id)})
                    )
                )
            )
        });
        
    }) // manejo de errores en la petición 
    .fail(function(textStatus, errorThrown ) {            
        console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
    }) 
}
listarProfesores();











/***
 * boton de eliminar
 */
function eliminar(id) {
    // limpiamos lo que haya en el modal
    $('#modal').empty();
    // creamos el modal nuevo
    $('#modal').append(
        // modal de confirmacion para eliminar
        $('<div>', {'class': 'modal fade', 'id': 'user_modal_eliminar', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'exampleModalCenterTitle', 'aria-hidden': 'true'}).append(
            $('<div>', {'class': 'modal-dialog modal-dialog-centered', 'role': 'document'}).append(
                $('<div>', {'class': 'modal-content'}).append(
                    $('<div>', {'class': 'modal-header'}).append(
                        $('<h5>', {'class': 'modal-title', 'id': 'exampleModalLongTitle', 'html': 'Eliminar Usuario'})                                
                    ),
                    $('<div>', {'class': 'modal-body'}).append(
                        $('<p>', {'html': '¿Seguro que quieres eliminar al usuario?'})
                    ),
                    $('<div>', {'class': 'modal-footer'}).append(
                        $('<button>', {'class': 'btn btn-secondary', 'type': 'button', 'data-dismiss': 'modal', 'html': 'Cancelar'}).click(function(){$('#user_modal_eliminar').modal('hide')}),
                        $('<button>', {'class': 'btn btn-danger', 'type' : 'button', 'html': 'Eliminar'}).click(function(){                                    
                            $('#user_modal_eliminar').modal('hide')
                            // si confirmamos el modal, se lanza la eliminacion de la bbdd
                            eliminarUsuario(id)
                        })
                    )
                )
            )
        )
    )
     // lanzamos el modal
     $('#user_modal_eliminar').modal('show');
}
function eliminarUsuario(id) {
    const span = $('#userSpan');     
    // lanzamos peticion de eliminación de proyecto
    $.ajax({
        type: "POST",
        url: "../assets/librerias/BBDD/eliminarUsuario.php",
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
        // si hay respuesta positiva volvemos a cargar la lista de profesores
        if (data) {
            listarProfesores();  
            $(span).removeAttr("class");
            $(span).html('Profesor eliminado correctamente');
            $(span).addClass('text-success');  
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












/***
*   FUNCION DE LOGOUT
*/
function logout(){
    window.location.href = "../index.php";
}


