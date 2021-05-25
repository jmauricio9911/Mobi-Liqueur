angular.module('app.cvProducts', [])
    .controller('cvProducts', cvProducts);

/*Inyección de dependencia*/
cvProducts.$inject = ['masterData', '$rootScope', 'global'];

function cvProducts(masterData, $rootScope, global) {
    /*Miembros del controlador*/
    var vmProducts = this;
    vmProducts.goToPage = goToPage;
    vmProducts.products = [];
    vmProducts.producto = {};
    vmProducts.cantProducto = 0;
    vmProducts.cantidad = global.car_cant;
    vmProducts.addCant = addCant;
    vmProducts.items = items;
    vmProducts.ListPromotions = [];
    vmProducts.init = function() {
        //Funcion inicial
        $rootScope.product = true;
        getProducts();
        getPromociones();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getProducts() {
        masterData.getData('api/producto/detail/')
            .then(function(data) {
                data.data.forEach(element => {
                    vmProducts.products.push(element)
                });
                console.log(vmProducts.products);
            });
    }

    function getPromociones() {
        masterData.getPromotions()
            .then(function(data) {
                data.data.forEach((element) => {
                    vmProducts.ListPromotions.push(element);
                });
                console.log(vmProducts.ListPromotions);
            });
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Adicionar item a el detalle del carrito**/

    function addCant(cant) {
        var cantidad = cant;
        if (cant > vmProducts.producto.Cantidad) {
            swal({
                title: "Error",
                text: "La cantidad indicada supera el maximo del producto.",
                icon: "error",
                buttons: true,
            });
            return;
        }
        global.car_cant = vmProducts.cantidad; //Cantidad Global
        //Organizamos detalle para la venta
        var detalle = {
            Id: vmProducts.producto.idProducto,
            Nombre: vmProducts.producto.Nombre,
            cantidad: cantidad,
            valor: vmProducts.producto.ValorUnitario,
            cantidadPr: vmProducts.producto.Cantidad,
            promosion: 0
        };
        //Validamos si el producto seleccionado tienen promocion vigente
        var promosion = vmProducts.ListPromotions.find(element => element.Producto_idProducto === vmProducts.producto.idProducto);
        var hoy = new Date();
        if (promosion) {
            //Validamos que la fecha de la promocion sea vigente
            var fechapromocion = new Date(promosion.FechaFin);
            if (fechapromocion.getTime() >= hoy.getTime()) {
                detalle.promosion = promosion.Descuento;
            } else {
                detalle.promosion = 0;
            }
        }
        global.detalle.push(detalle); //Agremaos el item a el detalle de la factura.
        $rootScope.cantidad = global.detalle.length;
        $("#Cancelar").trigger("click"); //Cerranos Ventana modal
        vmProducts.cantProducto = 0; //Recalcilamos cantidad para cada uno de los productos.
    }

    function items(item) {
        vmProducts.producto = item;
    }

}