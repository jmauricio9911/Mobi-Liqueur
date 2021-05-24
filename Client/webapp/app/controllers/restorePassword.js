angular.module('app.restore', [])
    .controller('cvRestore', cvRestore);

cvRestore.$inject = ['masterData', '$rootScope', '$routeParams','global'];

function cvRestore(masterData, $rootScope, $routeParams, global) {

    var vmRestore = this;

    vmRestore.init = function() {
        //  Funcion inicial
        $rootScope.session = false;
        $rootScope.product = false;
        localStorage.setItem("Authenticate", false);
        vmRestore.data = [];
        vmRestore.restore = restore;
    };

    function restore(data) {
        // validacion de datos
        vmRestore.data.error = ''
        if (data.confirmPassword === data.password) {
            masterData.UpdateData('api/user/' + $routeParams.id, {'password': CryptoJS.AES.encrypt(data.password, '123').toString()})
            .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    location.href = "#login";
                } else {
                    swal('Error');
                }
            });
        } else {
            vmRestore.data.error = 'Las contraseñas ingresadas no coinciden.'
        }
    }

}