angular.module('app.cvProducts', [])
    .controller('cvProducts', cvProducts);

/*Inyección de dependencia*/
cvProducts.$inject = ['masterData', 'global'];

function cvProducts(masterData, global) {
    /*Miembros del controlador*/
    var vmProducts = this;
    vmProducts.goToPage = goToPage;
    vmProducts.products = [];
    vmProducts.producto = {};
    vmProducts.cantProducto = 0;
    vmProducts.cantidad = global.car_cant;
    vmProducts.addCant = addCant;
    vmProducts.items = items;

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

    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Adicionar item a el detalle del carrito**/

    function addCant(cant) {
        vmProducts.cantidad = vmProducts.cantidad + cant; //Cantidad global de items
        var cantidad = cant;
        global.car_cant = vmProducts.cantidad; //Cantidad Global
        //Organizamos detalle para la venta
        var detalle = {
            Id: vmProducts.producto.idProducto,
            Nombre: vmProducts.producto.Nombre,
            cantidad: cantidad,
            valor: vmProducts.producto.ValorUnitario,
            cantidadPr: vmProducts.producto.Cantidad
        };

        global.detalle.push(detalle); //Agremaos el item a el detalle de la factura.
        $("#Cancelar").trigger("click"); //Cerranos Ventana modal
        vmProducts.cantProducto = 0; //Recalcilamos cantidad para cada uno de los productos.
        console.log(global.detalle);
    }

    function items(item) {
        vmProducts.producto = item;
    }

}