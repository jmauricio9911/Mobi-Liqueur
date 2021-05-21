/*Modulo Configuracion*/
angular.module('app.config', ['ngRoute'])
    .config(config);

/*Injeccion de dependencia*/
config.$inject = ['$routeProvider'];

function config($routeProvider) {


    $routeProvider
        .when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'cvLogin',
            controllerAs: 'vmLogin'
        })
        .when('/menu', {
            templateUrl: 'app/views/menu.html',
            controller: 'cvMenu',
            controllerAs: 'vmMenu'
        })
        .when('/subMenu', {
            templateUrl: 'app/views/subMenu.html',
            controller: 'cvSubMenu',
            controllerAs: 'vmSubMenu'
        })
        .when('/user', {
            templateUrl: 'app/views/user.html',
            controller: 'cvUser',
            controllerAs: 'vmUser'
        })
        .when('/products', {
            templateUrl: 'app/views/products.html',
            controller: 'cvProducts',
            controllerAs: 'vmProducts'
        })
        .when('/combo', {
            templateUrl: 'app/views/combo.html',
            controller: 'cvCombo',
            controllerAs: 'vmCombo'
        })
        .when('/adminProducts', {
            templateUrl: 'app/views/adminProducts.html',
            controller: 'cvAdminProducts',
            controllerAs: 'vmAdminProducts'
        })
        .when('/promosion', {
            templateUrl: 'app/views/promotion.html',
            controller: 'cvPromotion',
            controllerAs: 'cvPromotion'
        })
        .when('/venta', {
            templateUrl: 'app/views/sale.html',
            controller: 'cvSale',
            controllerAs: 'vmSale'
        })
        .when('/factura', {
            templateUrl: 'app/views/factura.html',
            controller: 'cvFactura',
            controllerAs: 'cvFactura'
        })
        .otherwise({
            templateUrl: 'app/views/products.html',
            controller: 'cvProducts',
            controllerAs: 'vmProducts'
        });

}