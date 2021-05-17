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
    cvFactura.comentario = "";
    cvFactura.idFact = 0;
    /*Variables tipo funcion del controlador*/
    cvFactura.borrar_detalle = borrar_detalle;
    cvFactura.buscarProducto = buscarProducto;
    cvFactura.actualizar = actualizar;
    cvFactura.buscarCliente = buscarCliente;
    cvFactura.guardar_factura = guardar_factura;
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
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para validar si desea crear el cliente o no**/
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
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para actualizar la pagina en  caso de que no se cree el cliente**/
    function nocrear() {
        cvFactura.detallefac = false;
        $scope.$apply();
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para crear factura de pedido y su respéctivo detalle**/
    function guardar_factura() {
        //Guardamos cabecera de la factura
        var fecha = new Date();
        fecha = fecha.toLocaleDateString()
        var cabecera = {
            Fecha: fecha,
            Total: cvFactura.valores.monto_neto,
            Observacion: cvFactura.comentario,
            Cliente_idCliente: cvFactura.cliente.idCliente,
            FormaPago: ""
        }
        masterData.CreteCabeceraVenta(cabecera)
            .then(function(data) {
                var localdata = data.data;
                createdetalle(localdata.id);
            });
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para crear el detalle de la factura**/
    function createdetalle(id) {
        cvFactura.idFact = id;
        var flac = false;
        //Recorremos el detalle de la factura para guardarlo 
        for (let index = 0; index < cvFactura.detalle.length; index++) {

            var item = {
                    "Factura_idFactura": id,
                    "Producto_idProducto": cvFactura.detalle[index].Id,
                    "cantidad": cvFactura.detalle[index].cantidad,
                    "valor": cvFactura.detalle[index].cantidad * cvFactura.detalle[index].valor
                }
                //Guardamos cada una de las posiciones
            guardarposiciones(item);
            flac = true;
        }

        //Mostramos mensaje success
        if (flac) {
            cvFactura.detallefac = true;
            cvFactura.detallefac = [];
            global.detalle = [];
            cvFactura.cliente = {};
            swal({
                title: "Factura Creada!",
                text: "ID: " + cvFactura.idFact,
                icon: "success",
            })
            cvFactura.goToPage('products');
        } else {
            swal({
                title: "Error!",
                text: "No se logro generar la factura",
                icon: "error",
            })
        }
    }

    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para guardar posiciones del detalle**/
    function guardarposiciones(item) {
        masterData.CreteCabeceradetalle(item)
            .then(function(data) {
                var localdata = data.data;
                console.log(localdata);
            });
    }


}