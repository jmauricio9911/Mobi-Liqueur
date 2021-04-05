angular.module('app.header', ['$scope', 'app.global'])
    .controller('cvHeader', cvHeader);

cvHeader.$inject = ['$scope', 'global'];

function cvHeader($scope, global) {

    $scope.init = function() {
        // Validar si se cierra o recarga la página
        window.onbeforeunload = () => '';
        //getUser();
    };

    function getUser() {
        try {
            // Crear el modelo 
            var userModel = new sap.ui.model.json.JSONModel();
            // Cargar los datos 
            userModel.loadData("/services/userapi/currentUser");
            // Agregue un controlador de finalización para capturar los datos de respuesta y cualquier error
            userModel.attachRequestCompleted(function onCompleted(oEvent) {
                if (oEvent.getParameter("success")) {
                    var name = `${userModel.oData.firstName} ${userModel.oData.lastName}`;
                    $scope.name = name;
                    global.user.name = name;
                    global.user.email = userModel.oData.email;
                } else {
                    var msg = oEvent.getParameter("errorObject").textStatus;
                    console.log(msg);
                }
            });
        } catch (error) {
            console.log(error);
            $scope.name = "Ghost";
        }
    }

}