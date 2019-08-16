var CuentasPorPagarSelecciondas = [];
var filter = {
    VencimientosHasta :"",
    Sucursal :"",
    Comprobante :"",
    CuentaContable :"",
    Tercero: ""
};
var index = 0;
var language = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};
var columnsHeaders = [
    { data: "", title: "" },
    { data: "Index", title: "Identificador" },
    {data:"Sucursal", title:"Sucursal"},
    {data:"Identificacion", title:"Identificación"},
    {data:"Nombre", title:"Nombre"},
    {data:"CuentaContable", title:"Cuenta Contable"},
    {data:"Documento", title:"Documento"},
    {data:"NumeroCuenta", title:"N° Cuota"},
    {data:"FechaVencimiento", title:"Fecha Vencimiento"},
    {data:"Comprobante", title:"Comprobante"},
    {data:"SaldoDocumento", title:"Saldo Documento"},
    {data: "ValorPagarInput", title: "Valor a Pagar"},
    {data: "Id", title: "Id"}
];
var errorMessageSelectedAccount = {
    index: "",
    empty: "Se deben seleccionar Cuentas",
    invaldValue: function () { return "En la Cuenta con identificador " + this.index + " el valor a pagar no puede ser mayor que el saldo del documento"},
};

var totalDocumento = 0;
var showvalue = false;

/**
 * Custom Filter
 */
function addCustomFilter() {
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        Sucursal = data[2];
        Identificacion = data[3];
        Nombre = data[4];
        CuentaContable = data[5];
        Documento = data[6];
        NumeroCuenta = data[7];
        FechaVencimiento = data[8];
        Comprobante = data[9];
        SaldoDocumento = data[10];

        if (isValueStringInArray(Sucursal, filter.Sucursal) &&
            CuentaContable.includes(filter.CuentaContable) &&
            Identificacion.includes(filter.Tercero) &&
            Comprobante.includes(filter.Comprobante)
            ) {
            if (filter.VencimientosHasta == "") {
                //totalDocumento += intVal(SaldoDocumento);
                return true;
            }
            else {
                filterdate = new Date(filter.VencimientosHasta);
                date = new Date(FechaVencimiento);
                if (filterdate.getTime() >= date.getTime()) {
                    //totalDocumento += intVal(SaldoDocumento);
                    return true;
                }
            }
        }
        return false;
    });
}

/**
 * Document Ready
 */
$(document).ready(() => {
    //select Multiple 
    $('.select-custom-multiple').select2();
    //declaracion de la tabla
    var table = $('#tableCuentasPagar').DataTable({
        "bFilter": true,
        "scrollX": 300,
        "language": language,
        'columnDefs': [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            },
            {
                "targets": [11,12,13],
                "visible": false,
                "searchable": false
            },
            {
                "targets": 10,
                "className": "aling-right"
            }
        ],
        'select': {
            'style': 'multi'
        },
        'order': [[1, 'asc']],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;

            // Total over all pages
            totalDocumento = api
                .column(10, { search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            //$(api.column(3).footer()).html(' $' + formatNumbrer(total));
        }
    });

    //data selected
    var tableSelected = $('#tableSelected').DataTable({
        "bFilter": true,
        "scrollX": 300,
        "language": language,
        "fixedColumns": true,
        'columnDefs': [
            {
                "defaultContent": "-",
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            },
            {
                "targets": [12],
                "visible": false,
                "searchable": false
            },
            {
                "targets": 10,
                "width": 150
            },
            {
                "targets": 10,
                "className": "aling-right"
            }

        ],
        'select': {
            'style': 'multi'
        },
        'order': [[1, 'asc']],
        'data': CuentasPorPagarSelecciondas,
        'columns': columnsHeaders,
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;

            // Total over all pages
            total = api
                .column(10)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            $(api.column(3).footer()).html(' $' + formatNumbrer(total));
        }
    });
    //send 0 to table 
    $(table.column(3).footer()).html('$' + 0);

    //deshabilitar boton cambiar
    $("#agregar").attr('disabled', 'disabled');

    //ocultar elmentos
    hideELmentTableCuentas();

    //hiden selection
    hideELmentTableSeleccion();

    //accion agregar
    $("#agregar").on("click", (e) => {
        e.preventDefault();
        rows_selected = table.rows({ selected: true }).data();
        getCuentasPorPagarSelecciondas(rows_selected);
        tableSelected.clear();
        tableSelected.rows.add(CuentasPorPagarSelecciondas);
        tableSelected.draw();
        $("#documentosVencidos").text(getDocumentosVencidos());
        $("#documentosPorVencer").text(getDocumentosPorVencer());
        $("#totalOrdenDePago").text(getTotalOrdenPago());
        showELmentTableSeleccion();
    });
    
    //evneto Buscar
    $("#searchFilter").on("click", (e) => {
        $("#agregar").removeAttr('disabled');
        e.preventDefault();
        getFilters();
        addCustomFilter();
        table.rows().deselect();
        table.draw();
        showvalue = true;
        showELmentTableCuentas();
        $(table.column(2).footer()).html(' $' + formatNumbrer(totalDocumento));
    });

    //lipiar busqueda
    $('#limpiarConsulta').on('click', function (e) {
        e.preventDefault();
        $("#agregar").attr('disabled', 'disabled');
        $.fn.dataTableExt.afnFiltering.length = 0;
        table.draw();

        $("#vencimientosHasta").val("");
        $('.select-custom-multiple').val(null).trigger("change");
        $("#comprobante").val("");
        $("#cuentaContable").val("");
        $("#tercero").val("");
        table.rows().deselect();

        $(table.column(2).footer()).html('$' + 0);
        hideELmentTableCuentas();
        showvalue = false;
    });

    //quitar elementos Ordenes Seleccionadas
    $('#quitarSecondSelecction').on('click', (e) => {
        e.preventDefault();
        rowsSelectedRemove = tableSelected.rows({ selected: true }).data();
        tableSelected.rows('.selected').remove().draw(false);
        removeCuentasPorPagarSelecciondas(rowsSelectedRemove);
        $("#documentosVencidos").text(getDocumentosVencidos());
        $("#documentosPorVencer").text(getDocumentosPorVencer());
        $("#totalOrdenDePago").text(getTotalOrdenPago());
        if (CuentasPorPagarSelecciondas == 0) {
            hideELmentTableSeleccion();
        }
    });

    //guardar()
    //$("#guardar").on('click', (e) => {
    //    if (validateForm()) {
    //        sendForm("Create");
    //    }
    //});

    //controles de formulario
    $("#guardar").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("Guardar")}
    });
    $("#aprobar").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("Aprobar"); }
    });
    $("#tercero").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("GenerarTercero");}
    });
    $("#total").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("GenerarTotal"); }
    });

    //controles parte baja

    //controles de formulario
    $("#guardarb").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("Guardar") }
    });
    $("#aprobarb").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("Aprobar"); }
    });
    $("#tercerob").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("GenerarTercero"); }
    });
    $("#totalb").on('click', (e) => {
        e.preventDefault();
        if (validateForm()) { sendForm("GenerarTotal"); }
    });

    $("firtsPage").on('click', (e) => { });
    $("backPage").on('click',(e)=>{});
    $("newPage").on('click',(e)=>{});
    $("nextPage").on('click',(e)=>{});
    $("lastPage").on('click',(e)=>{});


    //hide error selected
    $("#validatedeselected").css('display', 'none');
    $("#validatedeExist").css('display', 'none');
});

//hide elemnt cuentas
function hideELmentTableCuentas() {
    $("#tableCuentasPagar").addClass("hideElement");
    $("#tableCuentasPagar_info").addClass("hideElement");
    $("#tableCuentasPagar_paginate").addClass("hideElement");
    $(".dataTables_scrollFootInner").addClass("hideElement");
    $("#tableCuentasPagar_wrapper").addClass("hideElement");
    console.log($("#footerCuenta"));
}

//muestra la tabla cuentas
function showELmentTableCuentas() {
    $("#tableCuentasPagar").removeClass("hideElement");
    $("#tableCuentasPagar_info").removeClass("hideElement");
    $("#tableCuentasPagar_paginate").removeClass("hideElement");
    $(".dataTables_scrollFootInner").removeClass("hideElement");
    $("#tableCuentasPagar_wrapper").removeClass("hideElement");
}

//hide elemnt selección
function hideELmentTableSeleccion() {
    $("#tableSelected").addClass("hideElement");
    $("#tableSelected_info").addClass("hideElement");
    $("#tableSelected_paginate").addClass("hideElement");
    $("#tableSelected_wrapper").addClass("hideElement");
}

//muestra la tabla selección
function showELmentTableSeleccion() {
    $("#tableSelected").removeClass("hideElement");
    $("#tableSelected_info").removeClass("hideElement");
    $("#tableSelected_paginate").removeClass("hideElement");
    $("#tableSelected_wrapper").removeClass("hideElement");
}

// Remove the formatting to get integer data for summation
function intVal(i) {
    return typeof i === 'string' ?i.replace(/[\$,]/g, '') * 1 :typeof i === 'number' ?i : 0;
};

/**
 * Obtinen los filetros de busqueda en las variables definidas arriba
 * */
function getFilters() {
    filter.VencimientosHasta = $("#vencimientosHasta").val();
    filter.Sucursal = $("#sucursal").val();
    filter.Comprobante = $("#comprobante").val();
    filter.CuentaContable = $("#cuentaContable").val();
    filter.Tercero = $("#tercero").val();
}

/**
 * 
 * @param {any} value
 * @param {any} array
 */
function isValueStringInArray(value, array) {
    retorno = false;
    for (i = 0; i < array.length && retorno == false; i++) {
        if (value == array[i]) {
            retorno = true;
        }
    }
    return retorno;
}

/**
 * añade los objetos a cuentas seleccionadas
 * @param {any} array arreglo de elemntos eliminados
 */
function getCuentasPorPagarSelecciondas(array) {
    warning = "";
    for (i = 0; i < array.length; i++) {
        obj = getCuenta(array[i], index);
        find = false;
        for (j = 0; j < CuentasPorPagarSelecciondas.length && !find; j++) {
            obj2 = CuentasPorPagarSelecciondas[j];
            if (isEqualAccount(obj, obj2)) {
                find = true;
                warning += "la cuenta por pagar con el identificador " + obj.Index + " ya se encuentra seleccionada <br/>";
            }
        }
        if (!find) {
            CuentasPorPagarSelecciondas.push(obj);
            index++;
        }
    }

    if (warning != "") {
        $("#validatedeExist").html(warning);
        $("#validatedeExist").css('display', 'block');
    }
    else {
        $("#validatedeExist").css('display', 'none');
    }
}

/**
 * remueve las cuentas del array de cuentas seleccionadas
 * @param {any} array las cuentas seleccionadas
 */
function removeCuentasPorPagarSelecciondas(array) {
    for (i = 0; i < array.length; i++) {
        obj = array[i];
        for (j = 0; j < CuentasPorPagarSelecciondas.length; j++) {
            obj2 = CuentasPorPagarSelecciondas[j];
            if (isEqualAccount(obj, obj2)) {
                CuentasPorPagarSelecciondas.splice(j, 1);
            }
        }
    }
}

/**
 * obtiene cuenta de un array
 * @param {any} array arreglo de entrada
 * @param {any} index indice
 * @returns {any} obj retronode la cuenta
 */
function getCuenta(array, index) {
    obj = {};
    obj.Index = array[1];
    obj.Sucursal = array[2];
    obj.Identificacion = array[3];
    obj.Nombre = array[4];
    obj.CuentaContable = array[5];
    obj.Documento = array[6];
    obj.NumeroCuenta = array[7];
    obj.FechaVencimiento = array[8];
    obj.Comprobante = array[9];
    obj.SaldoDocumento = array[10];
    obj.Id = array[11];
    obj.ValorPagar = array[12];
    obj.IdSucursal = array[13];
    obj.ValorPagarInput = '<input class="form-control aling-right" type="text" id="' + obj.Index + 'ValorPagarI" name="" value="' + obj.ValorPagar + '"/>';
    return obj;
}

/**
 * Valida si dos objetos son iguales de acuerdo a sus propedades
 * @param {any} obj1 objeto 1
 * @param {any} obj2 objeto 2
 * @returns true si es igual de lo contrario false
 */
function isEqualAccount(obj1, obj2) {
    if (
        obj1.Sucursal == obj2.Sucursal &&
        obj1.Identificacion == obj2.Identificacion &&
        obj1.Nombre == obj2.Nombre &&
        obj1.CuentaContable == obj2.CuentaContable &&
        obj1.Documento == obj2.Documento &&
        obj1.NumeroCuenta == obj2.NumeroCuenta &&
        obj1.FechaVencimiento == obj2.FechaVencimiento &&
        obj1.Comprobante == obj2.Comprobante &&
        obj1.Id == obj2.Id
    ) { return true; } else { return false; }
}

/**
 * Obtiene los documentos vencidos
 * */
function getDocumentosVencidos() {
    cantidad = 0;
    today = new Date().getTime();
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        strVence = CuentasPorPagarSelecciondas[i].FechaVencimiento;
        dateVence = new Date(strVence).getTime();
        if (dateVence <= today) {
            cantidad++;
        }
    }
    return cantidad;
}

/**
 * Obtiene los documentos por vencer
 * */
function getDocumentosPorVencer() {
    cantidad = 0;
    today = new Date().getTime();
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++){
        strVence = CuentasPorPagarSelecciondas[i].FechaVencimiento;
        dateVence = new Date(strVence).getTime();
        if (dateVence > today) {
            cantidad++;
        }
    }
    return cantidad;
}

/**
 * obtiene el total de ordenes de pago
 */
function getTotalOrdenPago() {
    total = 0;
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        total += parseInt(CuentasPorPagarSelecciondas[i].SaldoDocumento);
    }
    return CuentasPorPagarSelecciondas.length;
}

/**
 * actualoza los valores a pagar de la tabla
 */
function refreshDataCuentasPorPagarSelecciondas() {
    toSend = [];
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        CuentasPorPagarSelecciondas[i].ValorPagar = $("#" + obj.Index + "ValorPagarI").val();
        copy = Object.assign({}, CuentasPorPagarSelecciondas[i]);
        copy.ValorPagarInput = "";
        toSend.push(copy);
    }
    return toSend;
}

/**
 * construye el fomulario
 * @param {any} route la ruta a donde se dirige el formulario
 */
function sendForm(route) {
    toSend=refreshDataCuentasPorPagarSelecciondas();
    var data = new FormData();
    console.log(toSend);
    data.append('TipoDocumento', $("#tipoDocumento").val());
    data.append('ProximoNumeroDisponible', $("#proximoNumeroDisponible").val());
    data.append('Fecha', $("#fecha").val());
    data.append('Detalle', $("#detalle").val());
    console.log(toSend);
    data.append('ListCuentaPorPagar', JSON.stringify(toSend));

    //var xhr = new XMLHttpRequest();
    //xhr.open('POST', route, true);
    //xhr.onload = function () {
    //    // do something to response
    //    //$(document).html(this.response);
    //    console.log(this);
    //    window.location = this.responseURL
    //};
    //xhr.send(data);
    $("#jsonvalue").val(JSON.stringify(toSend));
    $("#proximoNumeroDisponible").removeAttr("disabled");
    $("#FromData").attr("action",route);
    $("#FromData").submit();
}

/**
 * Se valida el formulario
 * */
function validateForm() {
    $("#validatefecha").css('display', 'none');
    $("#validatedetalle").css('display', 'none');
    $("#validatedeselected").css('display', 'none');
    retorno = true;
    fecha=$("#fecha").val();
    detalle = $("#detalle").val();
    listCuentaPorPagar = CuentasPorPagarSelecciondas.length;
    if (fecha == "") {
        $("#validatefecha").css('display', 'block');
        retorno = false;
    }
    if (detalle == "") {
        $("#validatedetalle").css('display', 'block');
        retorno = false;
    }
    if (listCuentaPorPagar == 0) {
        $("#validatedeselected").text(errorMessageSelectedAccount.empty);
        $("#validatedeselected").css('display', 'block');
        retorno = false;
    }
    else {
        messageErrorPrint = "";
        for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
            CuentasPorPagarSelecciondas[i].ValorPagar = $("#" + CuentasPorPagarSelecciondas[i].Index + "ValorPagarI").val();
            cuenta = CuentasPorPagarSelecciondas[i].Index;
            numeroValorPagar = Math.abs(Number(CuentasPorPagarSelecciondas[i].ValorPagar.replace(/,/g, '')));
            numeroSaldoDocumento = Math.abs(Number(CuentasPorPagarSelecciondas[i].SaldoDocumento.replace(/,/g,'')));
            if (numeroValorPagar > numeroSaldoDocumento) {
                errorMessageSelectedAccount.index = cuenta;
                messageErrorPrint += errorMessageSelectedAccount.invaldValue() + "<br/>";
                retorno = false;
            }
        }
        $("#validatedeselected").html(messageErrorPrint);
        $("#validatedeselected").css('display', 'block');
    }
    return retorno;
}

//gormatea los numeros 
function formatNumbrer(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}