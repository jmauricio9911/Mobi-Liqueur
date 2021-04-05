angular.module('app.cvProducts', [])
    .controller('cvProducts', cvProducts);

/*Inyección de dependencia*/
cvProducts.$inject = ['masterData', 'global'];

function cvProducts(masterData, global) {
    /*Miembros del controlador*/
    var vmProducts = this;
    vmProducts.goToPage = goToPage;
    vmProducts.products = [];
    
    vmProducts.init = function() {
        //Función inicial
        getProducts();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getProducts() {
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmProducts.products.push(element)
                });
            });
    }

}