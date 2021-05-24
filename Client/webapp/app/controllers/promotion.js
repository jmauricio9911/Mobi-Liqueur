angular.module('app.Promotion', ['jcs-autoValidate', 'app.global'])
    .controller('cvPromotion', cvPromotion);

/*Injeccion de dependencia*/
cvPromotion.$inject = ['masterData', '$scope', 'global'];

function cvPromotion(masterData, $scope, global) {
    /*Miembros del controlador*/
    var cvPromotion = this;

    cvPromotion.goToPage = goToPage;
    masterData.ValidateSession()

    cvPromotion.init = function() {
        //Funcion inicial 
        cvPromotion.products = [];
        cvPromotion.master = [];
        cvPromotion.master.ListPromotions = []; //Promosiones
        cvPromotion.Promotions = []; //Promosiones
        cvPromotion.Formulario = false; //Manejo de formulario
        cvPromotion.getPromotionOne = getPromotionOne;
        cvPromotion.saveData = saveData;
        cvPromotion.clearForm = clearForm;
        cvPromotion.btnAction = 'Guardar';
        getProducts();
        getPromotionsList();
        validateDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    function getProducts() {
        cvPromotion.products = []
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    cvPromotion.products.push(element)
                });
            });
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
                cvPromotion.Promotions = data.data;
                cvPromotion.Promotions.FechaInicio = convertFormat(data.data.FechaInicio);
                cvPromotion.Promotions.FechaFin = convertFormat(data.data.FechaFin);
                cvPromotion.btnAction = 'Actualizar';
            });
    }

    function clearForm() {
        cvPromotion.Promotions = []
        cvPromotion.Formulario = false; //Manejo de formulario
        cvPromotion.btnAction = 'Guardar'
        $scope.$apply();
    }

    function convertFormat(date){
        let newDate = new Date(date)
        let formatted_date = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + newDate.getDate();
        return formatted_date;
    }

    //Función para guardar datos
    function saveData(dataPromotion) {
        if (Object.keys(dataPromotion).length > 0) {
            if (dataPromotion.idPromocion) {
                updateData(dataPromotion)
            } else {
                var object = {
                    "Producto_idProducto": dataPromotion.Producto_idProducto,
                    "Descuento": dataPromotion.Descuento,
                    "FechaInicio": dataPromotion.FechaInicio,
                    "FechaFin": dataPromotion.FechaFin,
                }
                masterData.send('api/promotions/', object)
                    .then(function (data) {
                        if (data.data.message) {
                            swal("Exito", data.data.message, "success");
                            getPromotionsList();
                            clearForm();

                        } else {
                            swal('Error');
                        }
                    });
            }
        } else {
            //  validation
            swal("Error", 'Debe llenar el formulario', "error");
        }
    }

    //Función para actualizar datos
    function updateData(dataPromotion) {
        delete dataPromotion['Nombre'];
        masterData.UpdateData('api/promotions/' + dataPromotion.idPromocion, dataPromotion)
            .then(function (data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getPromotionsList();
                    clearForm();
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