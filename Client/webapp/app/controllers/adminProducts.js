angular.module('app.cvAdminProducts', [])
    .controller('cvAdminProducts', cvAdminProducts);

/*Inyección de dependencia*/
cvAdminProducts.$inject = ['masterData', 'global'];

function cvAdminProducts(masterData, global) {
    /*Miembros del controlador*/
    var vmAdminProducts = this;
    vmAdminProducts.goToPage = goToPage;
    vmAdminProducts.listProducts = [];
    vmAdminProducts.dataProducts = [];
    vmAdminProducts.getAdminProductOne = getAdminProductOne;
    vmAdminProducts.saveData = saveData;
    vmAdminProducts.clearForm = clearForm;
    vmAdminProducts.Formulario = false;
    vmAdminProducts.btnAction = 'Guardar';

    
    vmAdminProducts.init = function() {
        //Función inicial
        getAdminProducts();
        configDataTable();
    };

    function goToPage(page) {
        location.href = "#" + page;
    }

    // Función de ejemplo para obtener datos
    function getAdminProducts() {
        vmAdminProducts.listProducts = []
        masterData.getData('api/producto')
            .then(function(data) {
                data.data.forEach(element => {
                    vmAdminProducts.listProducts.push(element)
                });
            });
    }

    //Función para obtener un producto
    function getAdminProductOne(id) {
        vmAdminProducts.Formulario = true; //Manejo de formulario
        masterData.getDataById('api/producto/', id)
            .then(function(data) {
                vmAdminProducts.dataProducts = data.data
                vmAdminProducts.btnAction = 'Actualizar'
            });
    }

    //Función para guardar datos
    function saveData(dataProduct) {
        if(Object.keys(dataProduct).length > 0) {
            if(dataProduct.id) {
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

    function configDataTable() {
        $(document).ready(function() {
            $('#tableProduct').DataTable();
        } );
    }
}