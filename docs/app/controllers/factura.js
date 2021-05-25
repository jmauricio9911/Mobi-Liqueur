angular.module('app.cvFactura', [])
    .controller('cvFactura', cvFactura);
/*Inyección de dependencia*/
cvFactura.$inject = ['masterData', 'global', '$scope', '$rootScope'];

function cvFactura(masterData, global, $scope, $rootScope) {
    /*Miembros del controlador*/
    var cvFactura = this;
    cvFactura.goToPage = goToPage;
    /*Variables del controlador*/
    cvFactura.detalle = [];
    cvFactura.detallefac = true;
    cvFactura.cliente = {};
    cvFactura.comentario = "";
    cvFactura.idFact = 0;
    cvFactura.cuerpo = "";
    cvFactura.ListPromotions = [];
    cvFactura.descuento = 0;
    /*Variables tipo funcion del controlador*/
    cvFactura.borrar_detalle = borrar_detalle;
    cvFactura.buscarProducto = buscarProducto;
    cvFactura.actualizar = actualizar;
    cvFactura.buscarCliente = buscarCliente;
    cvFactura.guardar_factura = guardar_factura;
    cvFactura.cancelar_orden = cancelar_orden;
    /*Variables tipo obejto del controlador*/
    cvFactura.agregar = {
        producto_id: "",
        cantidad: 0
    };
    cvFactura.valores = {
        monto: 0,
        monto_aux: 0,
        monto_neto: 0,
        impuesto: 0,
        ISV: 0
    };

    cvFactura.init = function() {
        //Función inicial
        masterData.ValidateSession();
        getDetalleVenta();
        getPromociones();
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
            console.log(cvFactura.detalle);
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
                    cantidad: 0,
                    valor: item.ValorUnitario,
                    cantidadPr: item.Cantidad,
                    promosion: 0
                };
                //Validamos si el producto seleccionado tienen promocion vigente
                var promosion = cvFactura.ListPromotions.find(element => element.Producto_idProducto === item.idProducto);
                var hoy = new Date();
                if (promosion) {
                    //Validamos que la fecha de la promocion sea vigente
                    var fechapromocion = new Date(promosion.FechaFin);
                    if (fechapromocion.getTime() >= hoy.getTime()) {
                        producto.promosion = promosion.Descuento;
                    } else {
                        producto.promosion = 0;
                    }
                }
                if (cvFactura.detalle.length !== 0) {
                    validaritem(producto);
                } else {
                    cvFactura.detalle.push(producto);
                }

            });


    }

    function getPromociones() {
        masterData.getPromotions()
            .then(function(data) {
                data.data.forEach((element) => {
                    cvFactura.ListPromotions.push(element);
                });
                console.log(cvFactura.ListPromotions);
            });
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para validar si un item ya exiuste sobre el detaller**/
    function validaritem(item) {
        var flag = true;
        for (let index = 0; index < cvFactura.detalle.length; index++) {
            if (cvFactura.detalle[index].Id === item.Id) {
                cvFactura.detalle[index].cantidad = cvFactura.detalle[index].cantidad + 1;
                flag = false;
            }
        }
        if (flag) {
            cvFactura.detalle.push(item);
        }
        recalcular();
    }
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para recarcular los valores de la factura**/
    function recalcular() {

        // Calcular los montos
        cvFactura.valores.monto = 0;
        cvFactura.descuento = 0;

        for (item of cvFactura.detalle) {
            var valoritem = item.cantidad * item.valor;
            var descuento = valoritem * item.promosion / 100;
            cvFactura.descuento += cvFactura.descuento + descuento;
            cvFactura.valores.monto += item.valor * item.cantidad - descuento;
            cvFactura.valores.monto_aux += item.valor * item.cantidad;
        }

        cvFactura.valores.impuesto = cvFactura.valores.monto * cvFactura.valores.ISV;
        cvFactura.valores.monto_neto = cvFactura.valores.monto + cvFactura.valores.impuesto;
        console.log(cvFactura.descuento);

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
        fecha = fecha.split("/");
        var fn = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
        console.log(fn);
        var cabecera = {
            Fecha: fn,
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
                //Actualizamos la cantidad de los productos
            cantidadreal = cvFactura.detalle[index].cantidadPr - cvFactura.detalle[index].cantidad;
            idPr = cvFactura.detalle[index].Id;
            updateCantidad(cantidadreal, idPr);
            //Guardamos cada una de las posiciones
            guardarposiciones(item);
            flac = true;
        }

        //Mostramos mensaje success
        if (flac) {
            if (cvFactura.cliente.Correo !== "") {
                enviarcorreo();
            }
            cvFactura.detallefac = true;
            cvFactura.detallefac = [];
            global.detalle = [];
            cvFactura.cliente = {};
            $rootScope.cantidad = 0;
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
    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para  actulizar la cantidad del producto**/
    function updateCantidad(real, id) {
        var cant = {
            Cantidad: real
        }
        masterData.UpdateData('api/producto/' + id, cant)
            .then(function(data) {
                if (data.data.message) {
                    console.log('Cantidad Actualizada')
                } else {
                    console.error('Error al actualizar cantidad de producto');
                }

            });
    }

    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para Cancelar el pedido y limpiar las variables-*/
    function cancelar_orden() {
        swal({
                title: "Estas seguro?",
                text: "Seguro que desea cancelar la orden?",
                type: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    global.detalle = [];
                    cvFactura.detalle = [];
                    cvFactura.detallefac = true;
                    cvFactura.cliente = {};
                    cvFactura.comentario = "";
                    cvFactura.idFact = 0;
                    cvFactura.cuerpo = "";
                    cvFactura.agregar = {
                        producto_id: "",
                        cantidad: 0
                    };
                    cvFactura.valores = {
                        monto: 0,
                        monto_neto: 0,
                        impuesto: 0,
                        ISV: 0
                    };

                    $scope.$apply();
                } else {
                    console.log(no)
                }
            });
    }

    /**
     * @Autor Mauricio Urriola
     * @Fecha 16.05.2021
     * @descripcion Funcion para armar el cuerpo del correo*/
    function cuerpocorreo() {
        var data = cvFactura.detalle;
        var fecha = new Date();
        fecha = fecha.toLocaleDateString()
        let myhtml = `<!doctype html>
        <html>
           <head>
                <meta charset="utf-8">
                <title>PDF Result Template</title>
                <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  
                  th, td {
                    padding: 5px;
                    text-align: left;
                  }
                  </style>
            </head>
            <body>
            <div class="row">
            <div class="col-sm-4">
            <h4 class="page-header">
                Numero de Factura: ${cvFactura.idFact}
                
                Fecha: ${fecha}
            <h4>
            </div>
            <hr>
            <div class="col-sm-4">
                Datos Empresa:
                <address>
                <strong>${cvFactura.config.aplicativo } - ${cvFactura.config.Iniiniciales}</strong><br>
                ${ cvFactura.config.direccion }
                Teléfono: ${ cvFactura.config.telefono }<br>
                Email: ${ cvFactura.config.correo }
              </address>
            </div>
            <!-- /.col -->
            <hr>
            <div class="col-sm-4">
                Datos Cliente:
                <address>
                <strong>Nombre: ${cvFactura.cliente.Nombre}</strong><br>
                Direccion:${cvFactura.cliente.Direccion}<br>
                Teléfono: ${cvFactura.cliente.Telefono}<br>
                Email: ${cvFactura.cliente.Correo}
              </address>
            </div>
            <hr>
        <div class="col-xs-12">
        <h4>Detalle de productos</h4>
            <table>
            <tr>
              <td>Codigo</td>
              <td>Producto</td>
              <td>Cantidad</td>
              <td>SubTotal</td></tr>`
        for (let i = 0; i < data.length; i++) {
            myhtml += "<tr><td>" + data[i].Id + "</td>";
            myhtml += "<td>" + data[i].Nombre + "</td>";
            myhtml += "<td>" + data[i].cantidad + "</td>";
            var subtotal = data[i].cantidad * data[i].valor
            myhtml += "<td>" + subtotal + "</td>";
            myhtml += "</tr>";
        }
        myhtml += `</table>
        </div>
        <hr>
        <div class="row">
        <h3>Detalle del Pago</h3>
        <div class=" class="col-xs-6"">
            <table class="table">
                <tbody>
                    <tr>
                        <th style="width:50%">Subtotal:</th>
                        <td>${cvFactura.valores.monto}</td>
                    </tr>
                    <tr>
                        <th style="width:50%">Descuento:</th>
                        <td>${ cvFactura.descuento }</td>
                    </tr>
                    <tr>
                        <th>Impuesto (12%)</th>
                        <td>${ cvFactura.valores.impuesto}</td>
                    </tr>
                    <tr>
                        <th>Total:</th>
                        <td>${ cvFactura.valores.monto_neto}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    </div>
    </body>
    </html>
    `
        return myhtml;
    }

    function enviarcorreo() {
        asunto = cuerpocorreo();
        var mail = {
            "correo": cvFactura.cliente.Correo,
            "asunto": asunto
        };
        masterData.sentmail(mail)
            .then(function(data) {
                var localdata = data.data;
                console.log(localdata);
            });

    }

}