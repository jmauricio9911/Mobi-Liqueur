angular.module('app.header', ['$scope', 'app.global'])
    .controller('cvHeader', cvHeader);

cvHeader.$inject = ['$scope', 'global'];

function cvHeader($scope, global) {

    var cvHeader = this;
    cvHeader.cantidad = global.car_cant;
    $scope.init = function() {
        // Validar si se cierra o recarga la página
        window.onbeforeunload = () => '';
        //getUser();
    };

}