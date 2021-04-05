angular.module('app.cvAdminProducts', [])
    .controller('cvAdminProducts', cvAdminProducts);

/*Inyección de dependencia*/
cvAdminProducts.$inject = ['masterData', 'global'];

function cvAdminProducts(masterData, global) {
    /*Miembros del controlador*/
    var vmAdminProducts = this;
    vmAdminProducts.goToPage = goToPage;
    vmAdminProducts.adminProducts = [];
    
    vmAdminProducts.init = function() {
        //Función inicial
        getAdminProducts();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getAdminProducts() {
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmAdminProducts.adminProducts.push(element)
                });
            });
    }

}