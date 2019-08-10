using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using OdenPago.Models;

namespace OdenPago.Controllers
{
    public class OrdenPagoController : Controller
    {
        private OrdenPago _ordenPago = new OrdenPago {
            TipoDocumento = new string[] { "Tipo Documento 1", "Tipo Documento 2" },
            ProximoNumeroDisponible = 2134,
            Fecha = DateTime.Now,
            Detalle = "",
            ListCuentaPorPagar = new List<CuentaPorPagar> {
                new CuentaPorPagar {
                    Sucursal="Pasto",
                    CuentaContable="Cuenta Contable1",
                    Documento="Documento 1",
                    FechaVencimiento= DateTime.Now,
                    Identificacion="123567",
                    Nombre="Nombre 1",
                    NumeroCuenta="12345",
                    SaldoDocumento="-30000",
                    Comprobante="comprobante 1"
                }, new CuentaPorPagar {
                    Sucursal="Cali",
                    CuentaContable="Cuenta Contable2",
                    Documento="Documento 2",
                    FechaVencimiento= DateTime.Now,
                    Identificacion="1235656",
                    Nombre="Nombre 2",
                    NumeroCuenta="12789",
                    SaldoDocumento="100000",
                    Comprobante="comprobante 2"
                }, new CuentaPorPagar {
                    Sucursal="Bogota",
                    CuentaContable="Cuenta Contable3",
                    Documento="Documento 3",
                    FechaVencimiento= DateTime.Now,
                    Identificacion="12345765",
                    Nombre="Nombre 3",
                    NumeroCuenta="67890123",
                    SaldoDocumento="4000000",
                    Comprobante="comprobante 3"
                }
            }
        };

        // GET: OrdenPago
        public ActionResult Index()
        {
            return View(_ordenPago);
        }

        // GET: OrdenPago/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: OrdenPago/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: OrdenPago/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                _ordenPago.TipoDocumento = new string[] { collection["TipoDocumento"] };
                _ordenPago.ProximoNumeroDisponible = int.Parse(collection["ProximoNumeroDisponible"]);
                _ordenPago.Fecha= DateTime.ParseExact(collection["Fecha"], "yyyy-MM-dd", CultureInfo.InvariantCulture); 
                _ordenPago.Detalle=collection["Detalle"];
                string tempCuentas = collection["ListCuentaPorPagar"];
                List<CuentaPorPagar> resutlt = JsonConvert.DeserializeObject<List<CuentaPorPagar>>(tempCuentas);
                _ordenPago.ListCuentaPorPagar = resutlt;
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: OrdenPago/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: OrdenPago/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: OrdenPago/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: OrdenPago/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
