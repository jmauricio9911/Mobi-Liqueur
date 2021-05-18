angular.module('app.cvAdminProducts', [])
    .controller('cvAdminProducts', cvAdminProducts);

/*Inyección de dependencia*/
cvAdminProducts.$inject = ['masterData', 'global'];

function cvAdminProducts(masterData, global) {
    /*Miembros del controlador*/
    var vmAdminProducts = this;
    vmAdminProducts.goToPage = goToPage;
    vmAdminProducts.dataProducts = [];
    vmAdminProducts.getAdminProductOne = getAdminProductOne;
    vmAdminProducts.saveData = saveData;
    vmAdminProducts.clearForm = clearForm;
    vmAdminProducts.updateData = updateData;
    vmAdminProducts.Formulario = false;
    vmAdminProducts.btnAction = 'Guardar';


    vmAdminProducts.init = function() {
        //Función inicial
        vmAdminProducts.master = [];
        vmAdminProducts.master.ListProducts = [];
        getAdminProducts();
        validateDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getAdminProducts() {
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmAdminProducts.master.ListProducts.push(element);
                });
            });
    }

    //Función para obtener un producto
    function getAdminProductOne(id) {
        vmAdminProducts.Formulario = true; //Manejo de formulario
        masterData.getDataById('api/producto/', id)
            .then(function(data) {
                vmAdminProducts.dataProducts = data.data
                if (vmAdminProducts.dataProducts.Estado == 0) {
                    vmAdminProducts.dataProducts.Estado = false
                } else {
                    vmAdminProducts.dataProducts.Estado = true
                }
                vmAdminProducts.btnAction = 'Actualizar'
            });
    }

    //Función para guardar datos
    function saveData(dataProduct) {
        if (Object.keys(dataProduct).length > 0) {
            if (dataProduct.id) {
                updateData(dataProduct)
            } else {
                var object = {
                    "Nombre": dataProduct.Nombre,
                    "Cantidad": dataProduct.Cantidad,
                    "ValorUnitario": dataProduct.ValorUnitario,
                    "FechaVencimiento": dataProduct.FechaVencimiento,
                    "Estado": dataProduct.Estado,
                    // "NombreImagen": dataProduct.NombreImagen
                }
                masterData.send('api/producto', object)
                    .then(function(data) {
                        if (data.data.message) {
                            swal("Exito", data.data.message, "success");
                            getAdminProducts();
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
    function updateData(data) {
        masterData.UpdateData('api/producto/' + data.id, data)
            .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getAdminProducts();
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmAdminProducts.dataProducts = []
        vmAdminProducts.btnAction = 'Guardar'
    }

    /**
     * @Funcion : configDatatable
     * @Descripcion : Configuracion basica para dataTable en español ect.
     * @Fecha : 
     */

    function configDatatable() {

        $(document).ready(function() {
            $('#tableProduct').DataTable({
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
        if ($.fn.DataTable.isDataTable('#tableProduct')) {
            //Destruimos dataTable
            $('#tableProduct').DataTable().destroy();
            //Iniciamos nuevamente la configuracion DataTable
            configDatatable();
        } else {
            //Iniciamos configuracion
            configDatatable();
        }
    }

}