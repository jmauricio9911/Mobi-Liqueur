//Validar si un string contiene solo números
function expNumber(numero) {
    var regex = /^([0-9])*$/;
    return regex.test(numero);
}

//Valida si el email tiene un formato correcto
function formatEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

//Agrega miles y decimas
function formatMoney(n, c, d, t) {
    c = isNaN((c = Math.abs(c))) ? 2 : c;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "",
        i = String(parseFloat((n = Math.abs(Number(n) || 0).toFixed(c)))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return (
        s +
        (j ? i.substr(0, j) + t : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
        (c ? d.slice(2) : "")
    );
}

//Obtener la fecha de actual según formato deseado
function getCurrentDate(format) {
    var now = new Date();
    var dd = now.getDate();
    var mm = now.getMonth() + 1;
    var yyyy = now.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);

    //Formato para poder mostrar en campo date
    if (format === "y-m-d") {
        now = yyyy + '-' + mm + '-' + dd;
    }

    //Formato para archivo excel
    if (format === "d/m/y") {
        now = dd + '/' + mm + '/' + yyyy;
    }

    return now;

    function addZero(i) {
        if (i < 10) i = '0' + i;
        return i;
    }
}

//Convertir milisegundos a fecha segun formato
function millisecondsToDate(milliseconds, format) {

    var date = new Date(milliseconds);

    var dd = date.getUTCDate();
    var mm = date.getUTCMonth() + 1;
    var yyyy = date.getUTCFullYear();
    dd = addZero(dd);
    mm = addZero(mm);

    //Formato para poder mostrar en campo date
    if (format === "y-m-d") {
        date = yyyy + '-' + mm + '-' + dd;
    }

    //Formato para archivo excel
    if (format === "d/m/y") {
        date = dd + '/' + mm + '/' + yyyy;
    }

    return date;

    function addZero(i) {
        if (i < 10) i = '0' + i;
        return i;
    }
}

//Validar si fecha inicial es menor a fecha final
function validateGreaterThan(initialDate, finalDate) {
    var valuesStart = initialDate.split("-");
    var valuesEnd = finalDate.split("-");
    var dateStart = new Date(valuesStart[0], (valuesStart[1] - 1), valuesStart[2]);
    var dateEnd = new Date(valuesEnd[0], (valuesEnd[1] - 1), valuesEnd[2]);
    if (dateEnd >= dateStart) {
        return true;
    }
    return false;
}

//Cambiar fecha y-m-d por d/m/y
function dateDMY(date) {
    date = date.split("-");
    return `${date[2]}/${date[1]}/${date[0]}`;
}

/**
 * @function calcDate
 * @description Calcular tiempo trasncurrido entre dos fechas
 * @param {Date} date1 Fecha inicial
 * @param {Date} date2 Fecha final
 * @param {String} info  Datos que se desea saber (days, months, years)
 */
function calcDate(date1, date2, info) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);

    var message = "";

    switch (info) {
        case "days":
            message = days;
            break;
        case "months":
            message = months;
            break;
        case "years":
            message = years;
            break;
        default:
            message += days + " days "
            message += months + " months "
            message += years + " years"
            break;
    }
    return message;
}