/**
 *------------------------------------------------------------------------------------------------------
 * 																									   |
 *                          SERVICIO MAESTRO - New Inntech                                             |
 *      @author:                                       									               |
 *      @author:          Sebastian Cardona Loaiza	sebastian.cardona@gruponetw.com					   |
 *      @FECHA:           30 Marzo de 2020                                                             |
 *      @description:     Consumir microservicios REST principal   	                                   |
 *_____________________________________________________________________________________________________| */

angular.module('app.master', [])
    .factory('masterData', masterData);

masterData.$inject = ['$http', '$rootScope'];

function masterData($http, $rootScope) {

    // DESTINATION SCP
    // const URL = window.location.href.split("/webapp")[0] + "/myDestination";

    // Local
    const URL = "http://c9dd6dc7d928.ngrok.io/";

    var service = {
        getLoginByID: getLoginByID,
        getLogin: getLogin,
        getData: getData,
        getDataById: getDataById,
        send: send,
        UpdateData: UpdateData,
        DeleteData: DeleteData,
        getPromotions: getPromotions,
        getPromotionsOne: getPromotionsOne,
        DeletePromotions: DeletePromotions,
        UpdatePromotions: UpdatePromotions,
        CreatePromotions: CreatePromotions,
        CreteCabeceraVenta: CreteCabeceraVenta,
        CreteCabeceradetalle: CreteCabeceradetalle,
        sentmail: sentmail,
        ValidateSession: ValidateSession
    };
    return service;

    function getLogin() {
        return getData("/api/login");
    }

    function getLoginByID(urlLogin) {
        return getDataById("/api/login/search/findByID?id=", urlLogin);
    }

    function getPromotions() {
        return getData("api/promotions");
    }

    function getPromotionsOne(id) {
        return getData(`api/promotions/${id}`);
    }

    function DeletePromotions(id) {
        return getData(`api/promotions/${id}`);
    }

    function UpdatePromotions(id, json) {

        var object = {
            "Descuento": json.Descuento,
            "FechaInicio": json.FechaInicio,
            "FechaFin": json.FechaFin,
            "Estado": json.Estado,
            // "Producto_idProducto": json1111
        }
        return UpdateData(`api/promotions/${id}`, object);

    }

    function CreatePromotions(json) {
        return send(`api/promotions`, json);
    }

    function CreteCabeceraVenta(json) {
        return send(`api/venta`, json);
    }

    function CreteCabeceradetalle(json) {
        return send(`api/venta/detalle`, json);
    }

    function sentmail(json) {
        return send('api/mails', json)
    }

    /**
     * @function getData
     * @description Obtener datos de un recurso
     * @param {String} resource Recurso del cual se desea obtener datos
     */
    function getData(resource) {
        return $http({
            method: 'GET',
            url: URL + resource
        }).success(function(response, status, headers, config) {
            return response;
        }).error(function(response, status, headers, config) {
            abort(status);
        });
    }

    /**
     * @function getDataById
     * @description Obtener datos de un recurso filtrando por el ID de la tabla maestra
     * @param {String} resource Recurso del cual se desea obtener datos
     * @param {String} url_ID Identificador de tabla maestra
     */
    function getDataById(resource, url_ID) {
        return $http({
            method: 'GET',
            url: URL + resource + url_ID
        }).success(function(response, status, headers, config) {
            return response;
        }).error(function(response, status, headers, config) {
            swal(
                `ERROR ${status}`,
                "Ocurrió un error con el servicio.",
                "error"
            );
        });
    }

    /**
     * @function send
     * @description Enviar datos por POST
     * @param {String} resource Recurso al cual se desea enviar los datos
     * @param {JSON} json Estructura que sera procesada
     */
    function send(resource, json) {
        return $http({
            url: URL + resource,
            method: "POST",
            data: json
        }).success(function(data, status, headers, config) {
            return data;
        }).error(function(data, status, headers, config) {
            swal(
                `ERROR ${status}`,
                "Ocurrió un error con el servicio.",
                "error"
            );
            return data;
        });
    }

    function UpdateData(resource, json) {
        return $http({
            url: URL + resource,
            method: "PUT",
            data: json
        }).success(function(response, status, headers, config) {
            return response;
        }).error(function(response, status, headers, config) {
            swal(
                `ERROR ${status}`,
                "Ocurrió un error con el servicio.",
                "error"
            );
            return data;
        });
    }

    function DeleteData(resource, json) {
        return $http({
            url: URL + resource,
            method: "Delete"
        }).success(function(response, status, headers, config) {
            return response;
        }).error(function(response, status, headers, config) {
            swal(
                `ERROR ${status}`,
                "Ocurrió un error con el servicio.",
                "error"
            );
            return data;
        });
    }

    function ValidateSession() {
        if (localStorage.getItem('Authenticate') == 'true') {
            $rootScope.session = true;
        }
        $rootScope.product = false;
        if ($rootScope.session !== true) {
            location.href = "#login";
        }
    }
}