angular.module('app.cvUser', [])
    .controller('cvUser', cvUser);

/*Inyección de dependencia*/
cvUser.$inject = ['masterData', 'global', 'PagerService'];

function cvUser(masterData, global, PagerService) {
    /*Miembros del controlador*/
    var vmUser = this;
    vmUser.goToPage = goToPage;
    vmUser.dataUser = [];
    vmUser.getUserOne = getUserOne;
    vmUser.saveData = saveData;
    vmUser.clearForm = clearForm;
    vmUser.Formulario = false;
    vmUser.btnAction = 'Guardar';
    masterData.ValidateSession()

    vmUser.dummyItems; // dummy array of items to be paged
    vmUser.pager = {};
    vmUser.setPage = setPage;
    
    vmUser.init = function() {
        //Funcion inicial 
        vmUser.master = [];
        vmUser.master.ListUser = [];
        vmUser.master.ListRol = [];
        getRol();
        getUser();
    };

    function setPage(page) {
        if (page < 1 || page > vmUser.pager.totalPages) {
            return;
        }
        // get pager object from service
        vmUser.pager = PagerService.GetPager(vmUser.master.ListUser.length, page);
        // get current page of items
        vmUser.items = vmUser.dummyItems.slice(vmUser.pager.startIndex, vmUser.pager.endIndex + 1);
    }

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
                vmUser.dummyItems = vmUser.master.ListUser;
                vmUser.setPage(1);
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
                delete dataUser['password']
                updateData(dataUser)
            } else {
                var object = {
                    "Cedula": dataUser.Cedula,
                    "password": CryptoJS.AES.encrypt(dataUser.password, '123').toString(),
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
                        clearForm();
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
                    clearForm();
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmUser.Formulario = false;
        vmUser.dataUser = []
        vmUser.btnAction = 'Guardar'
    }

}