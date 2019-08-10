var CuentasPorPagar = [];
var CuentasPorPagarSelecciondas = [];
var filter = {};
var cuentasFiltradas=[];

$(document).ready(() => {
    function loadCuentaPorPagar() {
        let totalCuentas = $(".cuentaPorPagar").toArray().length;
        for (i = 0; i < totalCuentas; i++) {
            obj = getObject(i);
            CuentasPorPagar.push(obj);
            cuentasFiltradas.push(obj);
        }
    }
    loadCuentaPorPagar();
    $("#searchFilter").click(() => { search(); });
    $("#limpiarConsulta").click(() => { clearSearch(); });
    $("#agregar").click(() => { agregar(); });
});

function getObject(i) {
    let obj = {};
    obj.index = i;
    obj.selected = $("#" + i + "selected").is(':checked');
    obj.Sucursal = $("#" + i + "Sucursal").text();
    obj.Identificacion = $("#" + i + "Identificacion").text();
    obj.Nombre = $("#" + i + "Nombre").text();
    obj.CuentaContable = $("#" + i + "CuentaContable").text();
    obj.Documento = $("#" + i + "Documento").text();
    obj.NumeroCuenta = $("#" + i + "NumeroCuenta").text();
    obj.FechaVencimiento = $("#" + i + "FechaVencimiento").text();
    obj.SaldoDocumento = $("#" + i + "SaldoDocumento").text();
    return obj;
}

function getFilters() {
    filter.VencimientosHasta = $("#vencimientosHasta").val();
    filter.Sucursal = $("#sucursal").val();
    filter.Comprobante = $("#comprobante").val();
    filter.CuentaContable = $("#cuentaContable").val();
    filter.Tercero = $("#tercero").val();
}

function clearFilters() {
    $("#vencimientosHasta").val("");
    $("#sucursal").val("");
    $("#comprobante").val("");
    $("#cuentaContable").val("");
    $("#tercero").val("");
}

function search() {
    clearCheck();
    getFilters();
    cuentasFiltradas = searchInArray(CuentasPorPagar);
    render(cuentasFiltradas);
}

function clearSearch() {
    clearFilters();
    clearCheck();
    getFilters();
    cuentasFiltradas = searchInArray(CuentasPorPagar);
    render(cuentasFiltradas);
}

function searchInArray(objects) {
    retorno = [];
    for (i = 0; i < objects.length; i++) {
        if (objects[i].Sucursal.includes(filter.Sucursal) &&
            objects[i].CuentaContable.includes(filter.CuentaContable) &&
            objects[i].Nombre.includes(filter.Tercero)) {
            if (filter.VencimientosHasta == "") {
                retorno.push(objects[i]);
            }
            else {
                filterdate = new Date(filter.VencimientosHasta);
                date = new Date(objects[i].FechaVencimiento);
                if (filterdate.getTime() >= date.getTime()) {
                    retorno.push(objects[i]);
                }
            }
        }
    }
    return retorno;
}

function render(objects) {
    $("#cuentaPagarFirst").html("");
    for (i = 0; i < objects.length; i++) {
        item = objects[i];
        htmlrender = `
        <tr>
            <td id="`+ item.index + `cuentaPorPagar" class="cuentaPorPagar"><input onclick="selectCheck(0)"type="checkbox" id="` + item.index + `selected" value=""></td>
            <td id="`+ item.index + `Sucursal">` + item.Sucursal + `</td>
            <td id="`+ item.index + `Identificacion">` + item.Identificacion + `</td>
            <td id="`+ item.index + `Nombre">` + item.Nombre + `</td>
            <td id="`+ item.index + `CuentaContable">` + item.CuentaContable + `</td>
            <td id="`+ item.index + `Documento">` + item.Documento + `</td>
            <td id="`+ item.index + `NumeroCuenta">` + item.NumeroCuenta + `</td>
            <td id="`+ item.index + `FechaVencimiento">` + item.FechaVencimiento + `</td>
            <td id="`+ item.index + `SaldoDocumento">` + item.SaldoDocumento + `</td>
        </tr>`;
        $("#cuentaPagarFirst").html($("#cuentaPagarFirst").html() + htmlrender);
    }
}

function selectCheck(index) {
    for (i = 0; i < CuentasPorPagar.length; i++) {
        if (CuentasPorPagar[i].index == index) {
            if (CuentasPorPagar[i].selected == false) {
                CuentasPorPagar[i].selected = true;
                $("#" + index + "selected").attr('checked');
            }
            else {
                CuentasPorPagar[i].selected = false;
                $("#" + index + "selected").removeAttr('checked');
            }
        }
    }
    console.log(CuentasPorPagar);
}

function clearCheck() {
    for (i = 0; i < CuentasPorPagar.length; i++) {
        CuentasPorPagar[i].selected = false;
    }
}

function agregar() {
    agregarCuentasSeleccionadasArray();
    renderSeleccionadas(CuentasPorPagarSelecciondas);
    console.log(CuentasPorPagarSelecciondas);
    console.log(CuentasPorPagar);
}

function selectAll() {
    isSelectAll = $("#selectAll").is(':checked')
    if (isSelectAll == false) {
        for (i = 0; i < cuentasFiltradas.length; i++) {
            myPoint = cuentasFiltradas[i].index
            CuentasPorPagar[i].selected = false
            cuentasFiltradas[i].selected=false
            $("#" + myPoint + "selected").prop('checked', false)
        }
        $("#selectAll").removeAttr('checked')
    }
    else {
        for (i = 0; i < cuentasFiltradas.length; i++) {
            myPoint = cuentasFiltradas[i].index
            CuentasPorPagar[i].selected = true
            cuentasFiltradas[i].selected = true
            $("#" + myPoint + "selected").prop('checked', true)
        }
        $("#selectAll").attr('checked')
    }
    console.log(CuentasPorPagar)
}
//panel seleccionadas
function agregarCuentasSeleccionadasArray() {
    for (i = 0; i < CuentasPorPagar.length; i++) {
        if (CuentasPorPagar[i].selected == true) {
            isInArray = false
            for (j = 0; j < CuentasPorPagarSelecciondas.length && isInArray == false; j++) {
                if (CuentasPorPagar[i].index == CuentasPorPagarSelecciondas[j].index) {
                    isInArray = true;
                }
            }
            if (isInArray == false) {
                obj = Object.assign({},CuentasPorPagar[i]);
                obj.secondSelection = false
                obj.ValorPagar = Math.abs(obj.SaldoDocumento)
                CuentasPorPagarSelecciondas.push(obj);
            }
        }
    }
    console.log(CuentasPorPagarSelecciondas)
}

function renderSeleccionadas(objects) {
    $("#tbodySeleccionada").html("");
    for (i = 0; i < objects.length; i++) {
        item = objects[i];
        htmlrender = `
        <tr>
            <td id="`+ item.index + `cuentaPorPagarS" class="cuentaPorPagar"><input onclick="selectCheckSecond(` + item.index + `)"type="checkbox" id="` + item.index + `selectedS" value=""></td>
            <td id="`+ item.index + `SucursalS">` + item.Sucursal + `</td>
            <td id="`+ item.index + `IdentificacionS">` + item.Identificacion + `</td>
            <td id="`+ item.index + `NombreS">` + item.Nombre + `</td>
            <td id="`+ item.index + `CuentaContableS">` + item.CuentaContable + `</td>
            <td id="`+ item.index + `DocumentoS">` + item.Documento + `</td>
            <td id="`+ item.index + `NumeroCuentaS">` + item.NumeroCuenta + `</td>
            <td id="`+ item.index + `FechaVencimientoS">` + item.FechaVencimiento + `</td>
            <td id="`+ item.index + `SaldoDocumentoS">` + item.SaldoDocumento + `</td>
            <td id="`+ item.index + `ValorPagarS"><input class="form-control" type="text" id="` + item.index + `ValorPagarI" name="" value="` + item.ValorPagar + `"/></td>
            <!--<td id="`+ item.index + `ValorPagarS">` + item.ValorPagar + `</td>-->
        </tr>`;
        $("#tbodySeleccionada").html($("#tbodySeleccionada").html() + htmlrender);
    }
}

function selectAllSecond() {
    isSelectAll = $("#selectAllSecond").is(':checked')
    if (isSelectAll == false) {
        for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
            myPoint = CuentasPorPagarSelecciondas[i].index
            CuentasPorPagarSelecciondas[i].secondSelection = false
            $("#" + myPoint + "selectedS").prop('checked', false)
        }
        $("#selectAllSecond").prop('checked', false)
    }
    else {
        for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
            myPoint = CuentasPorPagarSelecciondas[i].index
            CuentasPorPagarSelecciondas[i].secondSelection = true
            $("#" + myPoint + "selectedS").prop('checked', true)
        }
        $("#selectAllSecond").prop('checked', true)
    }
    console.log(CuentasPorPagarSelecciondas)
}

function quitar() {
    removeSelctedElementsSecondSelection();
    renderSeleccionadas(CuentasPorPagarSelecciondas);
}

function removeSelctedElementsSecondSelection(){
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        if (CuentasPorPagarSelecciondas[i].secondSelection == true) {
            CuentasPorPagarSelecciondas.splice(i, 1);
        }
    }
}

function selectCheckSecond(index) {
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        if (CuentasPorPagarSelecciondas[i].index == index) {
            if (CuentasPorPagarSelecciondas[i].secondSelection == false) {
                CuentasPorPagarSelecciondas[i].secondSelection = true;
                //$("#" + index + "selected").attr('checked')
            }
            else {
                CuentasPorPagarSelecciondas[i].secondSelection = false;
                //$("#" + index + "selected").removeAttr('checked')
            }
        }
    }
    console.log(CuentasPorPagar)
}

function getValorAPagar() {
    for (i = 0; i < CuentasPorPagarSelecciondas.length; i++) {
        CuentasPorPagarSelecciondas.ValorPagar = $("#" + CuentasPorPagarSelecciondas[i].index + "ValorPagarI").val();
    }
}

function sendForm(route) {
    var data = new FormData();
    data.append('TipoDocumento', $("#tipoDocumento").val());
    data.append('ProximoNumeroDisponible', $("#proximoNumeroDisponible").val());
    data.append('Fecha', $("#fecha").val());
    data.append('Detalle', $("#detalle").val());
    data.append('ListCuentaPorPagar', JSON.stringify(CuentasPorPagarSelecciondas));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', route, true);
    xhr.onload = function () {
        // do something to response
        console.log(this.responseText);
    };
    xhr.send(data);
}