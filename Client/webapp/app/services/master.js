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

masterData.$inject = ['$http'];

function masterData($http) {

    // DESTINATION SCP
    // const URL = window.location.href.split("/webapp")[0] + "/myDestination"; 

    // Local
    const URL = "http://localhost:3000/";

    var service = {
        getHeadquartersByID: getHeadquartersByID,
        getHeadquarters: getHeadquarters,
        getData: getData,
        getDataById: getDataById,
        send: send,
        UpdateData: UpdateData,
        getPromotions: getPromotions,
        getPromotionsOne: getPromotionsOne,
        DeletePromotions: DeletePromotions,
        UpdatePromotions: UpdatePromotions,
        CreatePromotions: CreatePromotions
    };
    return service;

    function getHeadquarters() {
        return getData("/api/headquarters");
    }

    function getHeadquartersByID(urlHeadquarters) {
        return getDataById("/api/headquarters/search/findByID?id=", urlHeadquarters);
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
}