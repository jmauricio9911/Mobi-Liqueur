angular.module('app.header', ['$scope', 'app.global'])
    .controller('cvHeader', cvHeader);

cvHeader.$inject = ['$scope', '$rootScope', 'global'];

function cvHeader($scope, $rootScope, global) {

    var cvHeader = this;
    cvHeader.cantidad = global.car_cant;
    $rootScope.product = false;
    $scope.init = function() {
        //Funcion inicial 
        // Validar si se cierra o recarga la página
        window.onbeforeunload = () => '';
        //getUser();
    };

}