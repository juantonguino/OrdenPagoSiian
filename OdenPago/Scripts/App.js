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
    {data:"", title: "" },
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
    cuenta: "",
    empty: "Se deben seleccionar Cuentas",
    invaldValue: function () { return "En la Cuenta contable " + this.cuenta + " el valor a pagar no puede ser mayor que el saldo del documento"},
    lessZero: function(){return "En la Cuenta contable "+this.cuenta+" el valor a pagar no puede ser menor que cero o cero"}
};

var totalDocumento = 0;
var showvalue = false;

/**
 * Custom Filter
 */
function addCustomFilter() {
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        Sucursal = data[1];
        Identificacion = data[2];
        Nombre = data[3];
        CuentaContable = data[4];
        Documento = data[5];
        NumeroCuenta = data[6];
        FechaVencimiento = data[7];
        Comprobante = data[8];
        SaldoDocumento = data[9];

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
                "targets": [10],
                "visible": false,
                "searchable": false
            },
            {
                "targets": 9,
                "className": "aling-right"
            }
        ],
        'select': {
            'style': 'multi'
        },
        'order': [[1, 'asc']]
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
                "targets": [11],
                "visible": false,
                "searchable": false
            },
            {
                "targets": 10,
                "width": 150,
            },
            {
                "targets": 9,
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
                .column(9)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            $(api.column(3).footer()).html(' $' + formatNumbrer(total));
        }
    });


    //ocultar elmentos
    hideELmentTableCuentas();

    //hiden selection
    hideELmentTableSeleccion()

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
        e.preventDefault();
        totalDocumento = 0;
        getFilters();
        addCustomFilter();
        table.rows().deselect();
        table.draw();
        showvalue = true;
        showELmentTableCuentas();
    });

    //lipiar busqueda
    $('#limpiarConsulta').on('click', function (e) {
        e.preventDefault();
        $.fn.dataTableExt.afnFiltering.length = 0;
        table.draw();

        $("#vencimientosHasta").val("");
        $('.select-custom-multiple').val(null).trigger("change");
        $("#comprobante").val("");
        $("#cuentaContable").val("");
        $("#tercero").val("");

        totalDocumento = 0;
        table.rows().deselect();

        $(table.column(3).footer()).html('$' + totalDocumento);
        hideELmentTableCuentas()
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
    $("#guardar").on('click', (e) => {
        if (validateForm()) {
            sendForm("Create");
        }
    });

    //controles de formulario
    $("#guardar").on('click',(e)=>{
        if (validateForm()) { sendForm()}
    });
    $("#aprobar").on('click',(e)=>{
        if (validateForm()) { sendForm("aprobar"); }
    });
    $("#tercero").on('click',(e)=>{
        if (validateForm()) { sendForm("tercero");}
    });
    $("#total").on('click',(e)=>{
        if (validateForm()) { sendForm("total"); }
    });

});

//hide elemnt cuentas
function hideELmentTableCuentas() {
    $("#tableCuentasPagar").addClass("hideElement");
    $("#tableCuentasPagar_info").addClass("hideElement");
    $("#tableCuentasPagar_paginate").addClass("hideElement");
}

//muestra la tabla cuentas
function showELmentTableCuentas() {
    $("#tableCuentasPagar").removeClass("hideElement");
    $("#tableCuentasPagar_info").removeClass("hideElement");
    $("#tableCuentasPagar_paginate").removeClass("hideElement");
}

//hide elemnt selección
function hideELmentTableSeleccion() {
    $("#tableSelected").addClass("hideElement");
    $("#tableSelected_info").addClass("hideElement");
    $("#tableSelected_paginate").addClass("hideElement");
}

//muestra la tabla selección
function showELmentTableSeleccion() {
    $("#tableSelected").removeClass("hideElement");
    $("#tableSelected_info").removeClass("hideElement");
    $("#tableSelected_paginate").removeClass("hideElement");
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
function getCuentasPorPagarSelecciondas(array){
    for (i = 0; i < array.length; i++) {
        obj = getCuenta(array[i], index);
        find = false;
        for (j = 0; j < CuentasPorPagarSelecciondas.length && !find; j++) {
            obj2 = CuentasPorPagarSelecciondas[j];
            if (isEqualAccount(obj, obj2)) {
                find = true;
            }
        }
        if (!find) {
            CuentasPorPagarSelecciondas.push(obj);
            index++;
        }
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
    obj.Index = index;
    obj.Sucursal = array[1];
    obj.Identificacion = array[2];
    obj.Nombre = array[3];
    obj.CuentaContable = array[4];
    obj.Documento = array[5];
    obj.NumeroCuenta = array[6];
    obj.FechaVencimiento = array[7];
    obj.Comprobante = array[8];
    obj.SaldoDocumento = array[9];
    obj.Id = array[10];
    obj.ValorPagar = obj.SaldoDocumento;
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
    data.append('TipoDocumento', $("#tipoDocumento").val());
    data.append('ProximoNumeroDisponible', $("#proximoNumeroDisponible").val());
    data.append('Fecha', $("#fecha").val());
    data.append('Detalle', $("#detalle").val());
    data.append('ListCuentaPorPagar', JSON.stringify(toSend));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', route, true);
    xhr.onload = function () {
        // do something to response
        console.log(this.responseText);
    };
    xhr.send(data);
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
            cuenta = CuentasPorPagarSelecciondas[i].CuentaContable;
            numeroValorPagar = Math.abs(Number(CuentasPorPagarSelecciondas[i].ValorPagar.replace(/,/g, '')));
            numeroSaldoDocumento = Math.abs(Number(CuentasPorPagarSelecciondas[i].SaldoDocumento.replace(/,/g,'')));
            if ( numeroValorPagar> numeroSaldoDocumento) {
                errorMessageSelectedAccount.cuenta = cuenta;
                messageErrorPrint += errorMessageSelectedAccount.invaldValue() + "<br/>";
                retorno = false;
            }
        }
        $("#validatedeselected").html(messageErrorPrint);
        $("#validatedeselected").css('display', 'block');
    }
    return retorno;
}

function formatNumbrer(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}