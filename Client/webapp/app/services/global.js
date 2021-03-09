/**
 *------------------------------------------------------------------------------------------------------
 * 																									   |
 *                          SERVICIO GLOBAL -- New Inntech                                             |
 *      @author:                                       									               |
 *      	          Sebastian Cardona Loaiza	sebastian.cardona@gruponetw.com						   |
 *      @FECHA:        30 Marzo de 2020                                                                |
 *      @description: Se crea una servicio pasar datos entres los controladores	                       |
 *_____________________________________________________________________________________________________| */

angular.module('app.global', [])
    .factory('global', global);

function global() {
    return {
        data: {},
        user: {}
    };
}