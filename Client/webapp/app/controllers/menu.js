angular.module('app.cvMenu', ['app.global'])
    .controller('cvMenu', cvMenu);

/*Injeccion de dependencia*/
cvMenu.$inject = ['masterData', 'global'];

function cvMenu(masterData, global) {
    /*Miembros del controlador*/
    var vmMenu = this;

    vmMenu.goToPage = goToPage;
    masterData.ValidateSession()

    vmMenu.init = function() {
        //Funcion inicial 
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

}