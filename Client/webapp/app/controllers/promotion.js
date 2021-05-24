angular.module('app.Promotion', ['jcs-autoValidate', 'app.global'])
    .controller('cvPromotion', cvPromotion);

/*Injeccion de dependencia*/
cvPromotion.$inject = ['masterData', '$scope', 'global', 'PagerService'];

function cvPromotion(masterData, $scope, global, PagerService) {
    /*Miembros del controlador*/
    var cvPromotion = this;

    cvPromotion.goToPage = goToPage;
    masterData.ValidateSession()

    cvPromotion.dummyItems; // dummy array of items to be paged
    cvPromotion.pager = {};
    cvPromotion.setPage = setPage;

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
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    function setPage(page) {
        if (page < 1 || page > cvPromotion.pager.totalPages) {
            return;
        }
        // get pager object from service
        cvPromotion.pager = PagerService.GetPager(cvPromotion.master.ListPromotions.length, page);
        // get current page of items
        cvPromotion.items = cvPromotion.dummyItems.slice(cvPromotion.pager.startIndex, cvPromotion.pager.endIndex + 1);
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
        cvPromotion.master.ListPromotions = [];
        masterData.getPromotions()
            .then(function(data) {
                data.data.forEach((element) => {
                    cvPromotion.master.ListPromotions.push(element);
                });
                cvPromotion.dummyItems = cvPromotion.master.ListPromotions;
                cvPromotion.setPage(1);
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
        // $scope.$apply();
        // $scope.formulario.$setUntouched();
        // $scope.formulario.$setPristine();
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
}