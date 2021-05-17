angular.module('app.cvFactura', [])
    .controller('cvFactura', cvFactura);
/*Inyección de dependencia*/
cvFactura.$inject = ['masterData', 'global', '$scope'];

function cvFactura(masterData, global, $scope) {
    /*Miembros del controlador*/
    var cvFactura = this;
    cvFactura.goToPage = goToPage;
    /*Variables del controlador*/
    cvFactura.detalle = [];
    cvFactura.detallefac = true;
    cvFactura.cliente = {};
    /*Variables tipo funcion del controlador*/
    cvFactura.borrar_detalle = borrar_detalle;
    cvFactura.buscarProducto = buscarProducto;
    cvFactura.actualizar = actualizar;
    cvFactura.buscarCliente = buscarCliente;
    /*Variables tipo obejto del controlador*/
    cvFactura.agregar = {
        producto_id: "",
        cantidad: 1
    };
    cvFactura.valores = {
        monto: 0,
        monto_neto: 0,
        impuesto: 0,
        ISV: 0
    };

    cvFactura.init = function() {
        //Función inicial
        getDetalleVenta();
        cvFactura.hoy = new Date();
        cvFactura.config = global.config;
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Obtener detalle de la factura**/
    function getDetalleVenta() {
        cvFactura.detalle = global.detalle;
        if (cvFactura.detalle.length !== 0) {
            cvFactura.detallefac = false;
            recalcular();
        }
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Borrar item de la factura**/
    function borrar_detalle(item) {
        var index = cvFactura.detalle.indexOf(item);
        cvFactura.detalle.splice(index, 1);
        recalcular();
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Agregar items desde factura. evento enter**/
    function buscarProducto(producto) {
        if (producto.producto_id == "") {
            return;
        }
        //Buscamos productor por id
        masterData.getDataById('api/producto/', producto.producto_id)
            .then(function(data) {
                var item = data.data;
                var producto = {
                    Id: item.idProducto,
                    Nombre: item.Nombre,
                    cantidad: 1,
                    valor: item.ValorUnitario,
                    cantidadPr: item.Cantidad
                };
                cvFactura.detalle.push(producto);
                recalcular();
            });


    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para recarcular los valores de la factura**/
    function recalcular() {

        // Calcular los montos
        cvFactura.valores.monto = 0;

        for (item of cvFactura.detalle) {
            cvFactura.valores.monto += item.valor * item.cantidad;
        }

        cvFactura.valores.impuesto = cvFactura.valores.monto * cvFactura.valores.ISV;
        cvFactura.valores.monto_neto = cvFactura.valores.monto + cvFactura.valores.impuesto;

    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para actualizar valores si surge algun cambios**/
    function actualizar() {
        recalcular();
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para buscar el cliente y generar la factura**/
    function buscarCliente(id) {
        //Buscamos productor por id
        masterData.getDataById('api/cliente/', id)
            .then(function(data) {
                var item = data.data;
                if (item.status === 'E') {
                    optioncreate(item.text);
                } else {
                    cvFactura.cliente = item;
                    cvFactura.detallefac = false;
                }
            });

    }

    function optioncreate(text) {
        var mensaje = text + " " + "Desea crearlo?"
        swal({
                title: "Mensaje del sistema",
                text: mensaje,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    cvFactura.goToPage(cliente)
                } else {
                    nocrear();
                }
            });
    }

    function nocrear() {
        cvFactura.detallefac = false;
        $scope.$apply();
    }

}