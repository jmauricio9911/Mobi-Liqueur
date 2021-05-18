angular.module('app.cvUser', [])
    .controller('cvUser', cvUser);

/*Inyección de dependencia*/
cvUser.$inject = ['masterData', 'global'];

function cvUser(masterData, global) {
    /*Miembros del controlador*/
    var vmUser = this;
    vmUser.goToPage = goToPage;
    vmUser.dataUser = [];
    vmUser.getUserOne = getUserOne;
    vmUser.saveData = saveData;
    vmUser.clearForm = clearForm;
    vmUser.Formulario = false;
    vmUser.btnAction = 'Guardar';

    
    vmUser.init = function() {
        //Función inicial
        vmUser.master = [];
        vmUser.master.ListUser = [];
        vmUser.master.ListRol = [];
        getRol();
        getUser();
        validateDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getUser() {
        vmUser.master.ListUser = []
        masterData.getData('api/user')
            .then(function(data) {
                data.data.forEach(element => {
                    vmUser.master.ListUser.push(element);
                });
            });
    }
    function getRol() {
        masterData.getData('api/rol')
            .then(function(data) {
                data.data.forEach(element => {
                    vmUser.master.ListRol.push(element);
                });
            });
    }

    //Función para obtener un usuarios
    function getUserOne(id) {
        vmUser.Formulario = true; //Manejo de formulario
        masterData.getDataById('api/user/', id)
            .then(function(data) {
                vmUser.dataUser = data.data
                if (vmUser.dataUser.Estado == 0) {
                    vmUser.dataUser.Estado = false
                } else {
                    vmUser.dataUser.Estado = true
                }
                vmUser.btnAction = 'Actualizar'
            });
    }

    //Función para guardar datos
    function saveData(dataUser) {
        if(Object.keys(dataUser).length > 0) {
            if(dataUser.idUsuario) {
                updateData(dataUser)
            } else {
                var object = {
                    "Nombre": dataUser.Nombre,
                    "Edad": dataUser.Edad,
                    "Correo": dataUser.Correo,
                    "Celular": dataUser.Celular,
                    "Estado": dataUser.Estado,
                    "Rol_idRol": dataUser.Rol_idRol
                }
                masterData.send('api/user', object)
                .then(function(data) {
                    if (data.data.message) {
                        swal("Exito", data.data.message, "success");
                        getUser();
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
        masterData.UpdateData('api/user/' + data.idUsuario, data)
        .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getUser();
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmUser.dataUser = []
        vmUser.btnAction = 'Guardar'
    }
    
    /**
     * @Funcion : configDatatable
     * @Descripcion : Configuracion basica para dataTable en español ect.
     * @Fecha : 
     */

    function configDatatable() {

        $(document).ready(function() {
            $('#tableUser').DataTable({
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
        if ($.fn.DataTable.isDataTable('#tableUser')) {
            //Destruimos dataTable
            $('#tableUser').DataTable().destroy();
            //Iniciamos nuevamente la configuracion DataTable
            configDatatable();
        } else {
            //Iniciamos configuracion
            configDatatable();
        }
    }

}