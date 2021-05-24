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


    // Función de ejemplo para obtener datos
    function getLogin(user, password) {
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

}