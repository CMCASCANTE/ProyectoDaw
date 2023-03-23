// cargamos el login de Google
window.onload = function () {  
    google.accounts.id.initialize({
      // id de google
      client_id: "845694346795-lf5duj2d4ahpbt8hsikcjpqd8u4o4ifb.apps.googleusercontent.com",  
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { // customization attributes
        theme: "dark", 
        size: "large",
        shape: "circle"     
      }  
    );       
  
}    



// manejo de respuesta del login de google
function handleCredentialResponse(response) {
    // decodificamos los datos de la respuesta
    const responsePayload = parseJwt(response.credential);    

    // si el dominio es fpdrioja.com redirigimos al buscador con los datos que necesitemos, en caso contrario mensaje de error
    if (responsePayload.hd === "fpdrioja.com") {
        $.redirect("./appAlumno/buscador.php", {
          nombre: responsePayload.name,
          email: responsePayload.email,
          imagen: responsePayload.picture
        });
    } else {
      $('#loginGoogle').empty();
      $('#loginGoogle').append("<div class='col-auto d-inline alert alert-danger m-3'>Solo se puede acceder con una cuenta de fpdrioja.com válida</div>");
    }
}



// decodificar los datos de usuario de google
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



// login de profesor
function loginProfesor() {
    const user = $('#user').val();
    const password = $('#password').val();
    const nombre = "test";
  
    if (user==="" || password==="") {
      $('#loginProfesores').empty();
      $('#loginProfesores').append("<div class='col-auto d-inline alert alert-danger m-3'>Datos de acceso incorrectos</div>");
    } else {      

      // peticion para traer datos de login
      $.ajax({
        type: "POST",
        url: "./assets/librerias/BBDD/loginProfesores.php",
        data: {
          user: user,
          password: password
        },
        dataType: "json"        
      }) // manejo del resultado de la petición
      .done(function(data) {        
      
        // si devuelve resultados, cargmos profesores, sino mostramos error
        if (data) {
          $.redirect("./appProfesor/buscador.php", {
            nombre: data.nombre,
            id: data.id,
            admin: data.administrador     
          });
        } else {
          $('#loginProfesores').empty();
          $('#loginProfesores').append("<div class='col-auto d-inline alert alert-danger m-3'>Datos de acceso incorrectos</div>");
        }
      
      }) // manejo de errores en la petición 
      .fail(function(textStatus, errorThrown ) {            
          console.log( "La solicitud a fallado: " +  textStatus + " Error: " + errorThrown);
      })     
    }

    












    

}