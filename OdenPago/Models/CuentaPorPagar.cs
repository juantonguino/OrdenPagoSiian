using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OdenPago.Models
{
    public class CuentaPorPagar
    {
        public int Id { get; set; }
        public string Sucursal { get; set; }
        public string Identificacion { get; set; }
        public string Nombre { get; set; }
        public string CuentaContable { get; set; }
        public string Documento { get; set; }
        public string NumeroCuenta { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime FechaVencimiento { get; set; }
        public string SaldoDocumento { get; set; }
        public string ValorPagar { get; set; }
        public string Comprobante { get; set; }
    }
}