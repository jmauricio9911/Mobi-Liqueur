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
}