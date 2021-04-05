/*Modulo Configuracion*/
angular.module('app.config', ['ngRoute'])
    .config(config);

/*Injeccion de dependencia*/
config.$inject = ['$routeProvider'];

function config($routeProvider) {


    $routeProvider
        .when('/headquarters', {
            templateUrl: 'app/views/headquarters.html',
            controller: 'cvHeadquarters',
            controllerAs: 'vmHeadquarters'
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
        .when('/promosion', {
            templateUrl: 'app/views/promotion.html',
            controller: 'cvPromotion',
            controllerAs: 'cvPromotion'
        })
        .otherwise({
            redirectTo: "/headquarters"
        });

}