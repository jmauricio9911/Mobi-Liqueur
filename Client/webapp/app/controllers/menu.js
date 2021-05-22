angular.module('app.cvMenu', ['app.global'])
    .controller('cvMenu', cvMenu);

/*Injeccion de dependencia*/
cvMenu.$inject = ['masterData', 'global'];

function cvMenu(masterData, global) {
    /*Miembros del controlador*/
    var vmMenu = this;

    vmMenu.goToPage = goToPage;
    masterData.ValidateSession();
    vmMenu.facturas = 0;


    vmMenu.init = function() {
        //Funcion inicial 
        getFacturaDia(); //Obtenemos las facturas generedas en el dia.
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    /**
     * @Autor Mauricio urriola
     * @Fecha 21.05.2021
     */
    function getFacturaDia() {
        var fecha = new Date();
        fecha = fecha.toLocaleDateString()
        fecha = fecha.split("/");
        var fn = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
        masterData.getData(`api/venta/facturas/${fn}`)
            .then(function(data) {
                vmMenu.facturas = data.data[0].Num;
            });
    }

}