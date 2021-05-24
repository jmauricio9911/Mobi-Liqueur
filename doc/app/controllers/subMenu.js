angular.module('app.cvSubMenu', ['app.global'])
    .controller('cvSubMenu', cvSubMenu);

/*Injeccion de dependencia*/
cvSubMenu.$inject = ['global'];

function cvSubMenu(global) {
    /*Miembros del controlador*/
    var vmSubMenu = this;

    vmSubMenu.exit = exit;
    vmSubMenu.alert = alert;
    masterData.ValidateSession()

    vmSubMenu.init = function() {
        //Funcion inicial 
    };

    function exit() {
        location.href = "#menu";
    }

    function alert() {
        swal(
            "Alerta",
            `La sede ingresada es: ${global.user.headquarter}`,
            "success"
        );
    }

}