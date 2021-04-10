angular.module('app.Promotion', ['jcs-autoValidate', 'app.global'])
    .controller('cvPromotion', cvPromotion);

/*Injeccion de dependencia*/
cvPromotion.$inject = ['masterData', 'global'];

function cvPromotion(masterData, global) {
    /*Miembros del controlador*/
    var cvPromotion = this;

    cvPromotion.goToPage = goToPage;

    cvPromotion.init = function() {
        //Funcion inicial
        cvPromotion.master = [];
        cvPromotion.master.ListPromotions = []; //Promosiones
        cvPromotion.Promotions = []; //Promosiones
        cvPromotion.Formulario = false; //Manejo de formulario
        getPromotionsList();
        cvPromotion.getPromotionOne = getPromotionOne;
        cvPromotion.savedata = savedata;
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Funcion para obtener lista de promociones
    function getPromotionsList() {
        masterData.getPromotions()
            .then(function(data) {
                data.data.forEach((element) => {
                    cvPromotion.master.ListPromotions.push(element);
                });
            });
    }

    //Funcion para obtener una promosion
    function getPromotionOne(id) {
        cvPromotion.Formulario = true; //Manejo de formulario
        masterData.getPromotionsOne(id)
            .then(function(data) {
                cvPromotion.Promotions = data.data
                console.log(cvPromotion.Promotions)
            });
    }

    //Funcion para guardar datos
    function savedata(data) {
        masterData.UpdatePromotions(data.idPromocion, data)
            .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                } else {
                    swal('Error');
                }

            });

    }
    /**
     * @Funcion : configDatatable
     * @Descripcion : Configuracion basica para dataTable en español ect.
     * @Fecha : 
     */

    function configDatatable() {

        $(document).ready(function() {
            $('#promotions').DataTable({
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
        if ($.fn.DataTable.isDataTable('#promotions')) {
            //Destruimos dataTable
            $('#promotions').DataTable().destroy();
            //Iniciamos nuevamente la configuracion DataTable
            configDatatable();
        } else {
            //Iniciamos configuracion
            configDatatable();
        }
    }
}