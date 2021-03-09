angular.module('app.cvMenu', ['app.global'])
    .controller('cvMenu', cvMenu);

/*Injeccion de dependencia*/
cvMenu.$inject = ['global'];

function cvMenu(global) {
    /*Miembros del controlador*/
    var vmMenu = this;

    vmMenu.goToPage = goToPage;

    vmMenu.init = function() {
        //Funcion inicial
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

}