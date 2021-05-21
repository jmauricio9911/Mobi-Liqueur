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
        user: {},
        car_cant: 0,
        detalle: [],
        config: {
            aplicativo: "Mobi-Liqueur",
            Iniiniciales: "M-L",
            direccion: "CALLE 107 SUR #55-03",
            telefono: 3125976400,
            correo: "mobi-liqueur@gmail.com"
        },
    };
}