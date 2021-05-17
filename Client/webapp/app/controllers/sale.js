angular.module('app.cvSale', [])
    .controller('cvSale', cvSale);

/*Inyección de dependencia*/
cvSale.$inject = ['masterData', 'global'];

function cvSale(masterData, global) {
    /*Miembros del controlador*/
    var vmSale = this;
    vmSale.goToPage = goToPage;
    vmSale.getSaleOne = getSaleOne;
    vmSale.dataSale = [];
    
    vmSale.init = function () {
        vmSale.master = [];
        vmSale.master.ListSale = [];
        vmSale.master.ListDetailSale = [];
        getSale();
        validateDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getSale() {
        masterData.getData('api/venta')
            .then(function(data) {
                data.data.forEach(element => {
                    vmSale.master.ListSale.push(element);
                });
            });
    }

    //Función para obtener un venta
    function getSaleOne(sale) {
        vmSale.master.ListDetailSale = []
        vmSale.dataSale = sale
        masterData.getDataById('api/venta/', sale.idFactura)
            .then(function(data) {
                data.data.forEach(element => {
                    vmSale.master.ListDetailSale.push(element);
                });
            });
    }

    /**
     * @Funcion : configDatatable
     * @Descripcion : Configuracion basica para dataTable en español ect.
     * @Fecha : 
     */

    function configDatatable() {

        $(document).ready(function() {
            $('#tableSent').DataTable({
                "bFilter": false,
                "scrollY": "400px", //Tamaño de sroll
                "scrollCollapse": true, //Activamos el Scroll lateral
                "scrollX": true, //Activamos el Scrol inferior

                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "Todos"]
                ],
                "language": { //Configuracion de lenguaje
                    "lengthMenu": "Mostrando _MENU_ Registros", //Cantidad de registros a mostrar
                    "zeroRecords": "No se encontraron registros relacionados", //Texto de busqueda
                    "info": "Mostrando _PAGE_ pagina de _PAGES_ paginas", //Informacion de la paginacion
                    "infoEmpty": "No se encuentran registros disponibles", //
                    "infoFiltered": "(Se realizo busqueda en _MAX_ registros)", //Informacion de busqueda, si no se encuentran registros
                    "searching": true,
                    "search": "",
                    "paging": true,
                    "paginate": { //Configuracion de botones y paginacion
                        "next": "Siguiente", //Boton Siguiente
                        "previous": "Anterior" //Boton Anterior
                    },
                }
            });
        });
    }

    /**
     * @Funcion : validateDataTable
     * @Descripcion : Funciona para validar si la tabla a mapear es DataTable y no presentar errores al usurio
     * @Fecha :
     */
    function validateDataTable() {
        //Validamos si la tabla ya es DataTable para destuirla y reiniciarla.
        if ($.fn.DataTable.isDataTable('#tableSent')) {
            //Destruimos dataTable
            $('#tableSent').DataTable().destroy();
            //Iniciamos nuevamente la configuracion DataTable
            configDatatable();
        } else {
            //Iniciamos configuracion
            configDatatable();
        }
    }

}