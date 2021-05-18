angular.module('app.cvCombo', [])
    .controller('cvCombo', cvCombo);

/*Inyección de dependencia*/
cvCombo.$inject = ['masterData', 'global'];

function cvCombo(masterData, global) {
    /*Miembros del controlador*/
    var vmCombo = this;
    vmCombo.goToPage = goToPage;
    vmCombo.dataCombo = [];
    vmCombo.dataComboDetail = [];
    vmCombo.getComboOne = getComboOne;
    vmCombo.getComboDetail = getComboDetail;
    vmCombo.saveData = saveData;
    vmCombo.clearForm = clearForm;
    vmCombo.Formulario = false;
    vmCombo.btnAction = 'Guardar';

    
    vmCombo.init = function() {
        //Función inicial
        vmCombo.master = [];
        vmCombo.master.ListCombo = [];
        vmCombo.master.ListRol = [];
        getRol();
        getCombo();
        validateDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getCombo() {
        vmCombo.master.ListCombo = []
        masterData.getData('api/combo')
            .then(function(data) {
                data.data.forEach(element => {
                    vmCombo.master.ListCombo.push(element);
                });
            });
    }
    function getRol() {
        masterData.getData('api/rol')
            .then(function(data) {
                data.data.forEach(element => {
                    vmCombo.master.ListRol.push(element);
                });
            });
    }

    //Función para obtener un usuarios
    function getComboOne(id) {
        vmCombo.Formulario = true; //Manejo de formulario
        masterData.getDataById('api/combo/', id)
            .then(function(data) {
                vmCombo.dataCombo = data.data
                if (vmCombo.dataCombo.Estado == 0) {
                    vmCombo.dataCombo.Estado = false
                } else {
                    vmCombo.dataCombo.Estado = true
                }
                vmCombo.btnAction = 'Actualizar'
            });
    }

    //Función para obtener un usuarios
    function getComboDetail(data) {
        vmCombo.dataComboDetail = data
        masterData.getDataById('api/combo/', data.idCombo)
            .then(function(data) {
                vmCombo.dataComboDetail = data.data
                if (vmCombo.dataComboDetail.Estado == 0) {
                    vmCombo.dataComboDetail.Estado = false
                } else {
                    vmCombo.dataComboDetail.Estado = true
                }
                vmCombo.btnAction = 'Actualizar'
            });
    }

    //Función para guardar datos
    function saveData(dataCombo) {
        if(Object.keys(dataCombo).length > 0) {
            if(dataCombo.idCombo) {
                updateData(dataCombo)
            } else {
                var object = {
                    "Nombre": dataCombo.Nombre,
                    "Valor": dataCombo.Valor,
                    "Estado": dataCombo.Estado,
                }
                masterData.send('api/combo', object)
                .then(function(data) {
                    if (data.data.message) {
                        swal("Exito", data.data.message, "success");
                        getCombo();
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
        masterData.UpdateData('api/combo/' + data.idCombo, data)
        .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getCombo();
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmCombo.dataCombo = []
        vmCombo.btnAction = 'Guardar'
    }
    
    /**
     * @Funcion : configDatatable
     * @Descripcion : Configuracion basica para dataTable en español ect.
     * @Fecha : 
     */

    function configDatatable() {

        $(document).ready(function() {
            $('#tableCombo').DataTable({
                "bFilter": false,
                // "scrollY": "400px", //Tamaño de sroll
                // "scrollCollapse": true, //Activamos el Scroll lateral
                // "scrollX": true, //Activamos el Scrol inferior
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
        if ($.fn.DataTable.isDataTable('#tableCombo')) {
            //Destruimos dataTable
            $('#tableCombo').DataTable().destroy();
            //Iniciamos nuevamente la configuracion DataTable
            configDatatable();
        } else {
            //Iniciamos configuracion
            configDatatable();
        }
    }

}