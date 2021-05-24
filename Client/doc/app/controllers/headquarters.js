angular.module('app.login', [])
    .controller('cvHeadquarters', cvHeadquarters);

cvHeadquarters.$inject = ['masterData', 'global'];

function cvHeadquarters(masterData, global) {

    var vmHeadquarters = this;

    vmHeadquarters.init = function() {
        vmHeadquarters.master = [];
        vmHeadquarters.login = login;
    };


    function login() {
        // Guardar en datos globales de usuario
        location.href = "#menu";
    }


    // Funcion de ejemplo para obtener datos
    function getHeadquarters() {
        masterData.getHeadquarters()
            .then(function(data) {

            });
    }

}