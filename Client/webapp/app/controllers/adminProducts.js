angular.module('app.cvAdminProducts', [])
    .controller('cvAdminProducts', cvAdminProducts);

/*Inyección de dependencia*/
cvAdminProducts.$inject = ['masterData', 'global', 'PagerService'];

function cvAdminProducts(masterData, global, PagerService) {
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
    masterData.ValidateSession()

    vmAdminProducts.dummyItems; // dummy array of items to be paged
    vmAdminProducts.pager = {};
    vmAdminProducts.setPage = setPage;

    vmAdminProducts.init = function() {
        //Funcion inicial 
        vmAdminProducts.master = [];
        vmAdminProducts.master.ListProducts = [];
        getAdminProducts();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    function setPage(page) {
        if (page < 1 || page > vmAdminProducts.pager.totalPages) {
            return;
        }
        // get pager object from service
        vmAdminProducts.pager = PagerService.GetPager(vmAdminProducts.master.ListProducts.length, page);
        // get current page of items
        vmAdminProducts.items = vmAdminProducts.dummyItems.slice(vmAdminProducts.pager.startIndex, vmAdminProducts.pager.endIndex + 1);
    }

    // Función de ejemplo para obtener datos
    function getAdminProducts() {
        vmAdminProducts.master.ListProducts = [];
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmAdminProducts.master.ListProducts.push(element);
                });
                vmAdminProducts.dummyItems = vmAdminProducts.master.ListProducts;
                vmAdminProducts.setPage(1);
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
                vmAdminProducts.dataProducts.FechaVencimiento = convertFormat(data.data.FechaVencimiento);
                vmAdminProducts.btnAction = 'Actualizar'
            });
    }

    function convertFormat(date){
        let newDate = new Date(date)
        let formatted_date = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (newDate.getDate())).slice(-2);
        return formatted_date;
    }

    //Función para guardar datos
    function saveData(dataProduct) {
        if (Object.keys(dataProduct).length > 0) {
            if (dataProduct.idProducto) {
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
        masterData.UpdateData('api/producto/' + data.idProducto, data)
            .then(function(data) {
                if (data.data.message) {
                    swal("Exito", data.data.message, "success");
                    getAdminProducts();
                    clearForm();
                } else {
                    swal('Error');
                }

            });

    }

    function clearForm() {
        vmAdminProducts.dataProducts = []
        vmAdminProducts.btnAction = 'Guardar'
    }
}