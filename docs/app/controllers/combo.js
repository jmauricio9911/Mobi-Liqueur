angular.module('app.cvCombo', [])
    .controller('cvCombo', cvCombo);

/*Inyección de dependencia*/
cvCombo.$inject = ['masterData', 'global', 'PagerService'];

function cvCombo(masterData, global, PagerService) {
    /*Miembros del controlador*/
    var vmCombo = this;
    vmCombo.products = [];
    vmCombo.dataCombo = [];
    vmCombo.dataComboDetail = [];
    vmCombo.dataComboProducto = [];
    vmCombo.goToPage = goToPage;
    vmCombo.getComboOne = getComboOne;
    vmCombo.getComboDetail = getComboDetail;
    vmCombo.getComboProduct = getComboProduct;
    vmCombo.saveData = saveData;
    vmCombo.saveDataDetail = saveDataDetail; 
    vmCombo.removeComboProduct = removeComboProduct; 
    vmCombo.clearForm = clearForm;
    vmCombo.clearFormDetail = clearFormDetail;
    vmCombo.Formulario = false;
    vmCombo.btnAction = 'Guardar';
    vmCombo.btnActionDetail = 'Guardar';
    masterData.ValidateSession()

    vmCombo.dummyItems; // dummy array of items to be paged
    vmCombo.pager = {};
    vmCombo.setPage = setPage;

    
    vmCombo.init = function() {
        //Funcion inicial 
        vmCombo.master = [];
        vmCombo.master.ListCombo = [];
        vmCombo.master.ListDetailCombo = [];
        getCombo();
    };

    function setPage(page) {
        if (page < 1 || page > vmCombo.pager.totalPages) {
            return;
        }
        // get pager object from service
        vmCombo.pager = PagerService.GetPager(vmCombo.master.ListCombo.length, page);
        // get current page of items
        vmCombo.items = vmCombo.dummyItems.slice(vmCombo.pager.startIndex, vmCombo.pager.endIndex + 1);
    }

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
                vmCombo.dummyItems = vmCombo.master.ListCombo;
                vmCombo.setPage(1);
            });
    }
    
    function getProducts() {
        vmCombo.products = []
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmCombo.products.push(element)
                });
            });
    }

    //Función para obtener un combo
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

    //Función para obtener un detalle de combo
    function getComboDetail(data) {
        getProducts();
        vmCombo.dataComboDetail = data
        vmCombo.master.ListDetailCombo = []
        masterData.getDataById('api/combo/detail/', data.idCombo)
            .then(function(data) {
                data.data.forEach(element => {
                    vmCombo.master.ListDetailCombo.push(element);
                });
            });
    }

    function getComboProduct(data) {
        vmCombo.dataComboProducto = data
        vmCombo.dataComboProducto.Producto_idProducto = data.idProducto
        vmCombo.btnActionDetail = 'Actualizar'
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
                        clearForm()
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

    function saveDataDetail(dataComboProducto) {
        if(Object.keys(dataComboProducto).length > 0) {
            if(dataComboProducto.id) {
                var object = {
                    "id": dataComboProducto.id,
                    "Combo_idCombo": vmCombo.dataComboDetail.idCombo,
                    "Producto_idProducto": dataComboProducto.Producto_idProducto,
                    "Cantidad": dataComboProducto.Cantidad
                }
                updateDataComboProduct(object)
            } else {
                var object = {
                    "Combo_idCombo": vmCombo.dataComboDetail.idCombo,
                    "Producto_idProducto": dataComboProducto.Producto_idProducto,
                    "Cantidad": dataComboProducto.Cantidad
                }
                masterData.send('api/combo/detail', object)
                .then(function(data) {
                    if (data.data.message) {
                        swal("Exito", data.data.message, "success");
                        getComboDetail(vmCombo.dataComboDetail);
                        clearFormDetail()
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
                    clearForm()
                } else {
                    swal('Error');
                }
            });
    }

    function updateDataComboProduct(data) {
        masterData.UpdateData('api/combo/detail/' + data.id, data)
        .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getComboDetail(vmCombo.dataComboDetail);
                    clearFormDetail()
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmCombo.dataCombo = []
        vmCombo.btnAction = 'Guardar'
    }

    function clearFormDetail() {
        vmCombo.dataComboProducto = []
        vmCombo.btnActionDetail = 'Guardar'
    }
    
    function removeComboProduct(id) {
        masterData.DeleteData('api/combo/detail/' + id)
        .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getComboDetail(vmCombo.dataComboDetail);
                    clearFormDetail();
                } else {
                    swal('Error');
                }
            });
    }
}