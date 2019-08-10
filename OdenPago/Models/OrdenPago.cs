using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OdenPago.Models
{
    public class OrdenPago
    {
        public string[] TipoDocumento { get; set; }

        public int ProximoNumeroDisponible { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime Fecha { get; set; }

        public List<CuentaPorPagar> ListCuentaPorPagar { get; set; } 

        public string Detalle { get; set; }
    }
}