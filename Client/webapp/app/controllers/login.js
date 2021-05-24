angular.module('app.login', [])
    .controller('cvLogin', cvLogin);

cvLogin.$inject = ['masterData', '$rootScope', 'global'];

function cvLogin(masterData, $rootScope, global) {

    var vmLogin = this;

    vmLogin.init = function() {
        //Funcion inicial 
        $rootScope.session = false;
        $rootScope.product = false;
        localStorage.setItem("Authenticate", false);
        vmLogin.master = [];
        vmLogin.data = [];
        vmLogin.login = login;
        vmLogin.restorePassword = restorePassword;
    };


    function login(data) {
        // Guardar en datos globales de 
        vmLogin.data.error = ''
        if (data.usuario && data.password) {
            getLogin(data.usuario, data.password)
        } else {
            vmLogin.data.error = 'Usuario y contraseña son obligatorios'
        }
    }
 
    function restorePassword(data) {
        // Restablecer contraseña
        vmLogin.data.error = '';
        masterData.getDataById('api/login/', data.usuario)
            .then(function(data) {
                enviarCorreo(data.data);
            }).catch(function(error){
                // console.log(error)
                vmLogin.data.error = 'El usuario indicado no existe'
            })
    }


    // Función de ejemplo para obtener datos
    function getLogin(user, password) {
        vmLogin.data.error = '';
        masterData.getDataById('api/login/', user)
            .then(function(data) {
                var decrypt = CryptoJS.AES.decrypt(data.data.password, '123').toString(CryptoJS.enc.Utf8)
                if (password == decrypt) {
                    localStorage.setItem("Authenticate", true);
                    $rootScope.session = true;
                    location.href = "#menu";
                } else {
                    vmLogin.data.error = 'La contraseña ingresada es incorrecta'
                }
            }).catch(function(error){
                // console.log(error)
                vmLogin.data.error = 'El usuario indicado no existe'
            })
    }

    
    function cuerpoCorreo(nombre, id) {
        var data = cvFactura.detalle;
        var fecha = new Date();
        fecha = fecha.toLocaleDateString()
        let myHtml = `<!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>PDF Result Template</title>
        </head>
        
        <body>
            <div class="row">
                <div class="col-sm-4">
                    <h2 class="page-header">
                        ¡Hola ${nombre}
                        <br>
                    </h2>
                    <H3>
                        <br>
                        Restablecer contraseña    
                        <br>
                    </H3>
                    <h4>
                        Recibimos una solicitud para restablecer tu contraseña de Mobiliqueur. Haz clic sobre el siguiente link:
                        <br>
                        <br>
                        <a rel="stylesheet" href="http://localhost/webapp/#/restorePassword/${id}">Restablecer contraseña</a>
                        <br>
                        <br>
                        Te sugerimos seguir estas recomendaciones para crear una contraseña segura:
                        <br>
                        - Longitud mínima de 8 caracteres
                        <br>
                        - Combinaciones alfanuméricas
                        <br>
                        - Evitar palabras comunes
                    </h4>
                </div>
                <hr>
            </div>
            </div>
        </body>
        </html>`
        return myHtml;
    }

   function enviarCorreo(data) {
       asunto = cuerpoCorreo(data.Nombre, data.idUsuario);
       var mail = {
           "correo": data.Correo,
           "asunto": asunto
       };
       masterData.UpdateData('api/mails/restorePassword/', mail)
           .then(function(data) {
               var localdata = data.data;
               swal("Exito", 'Sé envió el correo exitosamente.', "success");
            }).catch(function(error){
                swal("Error", 'Sé presentaron problemas durante el envió del correo.', "error");
           });
   }

}