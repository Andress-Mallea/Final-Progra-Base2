using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas.SQLModels;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturasControlador : ControllerBase
    {
        private readonly InterfasGenerica<Factura> _facturaRepository;

        public FacturasControlador()
        {
            _facturaRepository = AlmacenDeDependecias.FacturaTabla;
        }

        // GET: api/Facturas
        [HttpGet]
        public ActionResult<List<Factura>> GetFacturas()
        {
            var facturas = _facturaRepository.GetAll();
            return Ok(facturas);
        }

        // GET: api/Facturas/1
        [HttpGet("{id}")]
        public ActionResult<Factura> GetFactura(int id)
        {
            var factura = _facturaRepository.GetById(id);
            if (factura == null)
            {
                return NotFound();
            }
            return Ok(factura);
        }

        // POST: api/Facturas
        [HttpPost]
        public ActionResult<Factura> PostFactura(Factura factura)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _facturaRepository.Add(factura);
                return CreatedAtAction(nameof(GetFactura), new { id = factura.FacturaID }, factura);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear factura: {ex.Message}");
            }
        }

        // PUT: api/Facturas/1
        [HttpPut("{id}")]
        public IActionResult PutFactura(int id, Factura factura)
        {
            if (id != factura.FacturaID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingFactura = _facturaRepository.GetById(id);
                if (existingFactura == null) return NotFound();
                _facturaRepository.Update(factura);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar factura: {ex.Message}");
            }
        }

        // DELETE: api/Facturas/1
        [HttpDelete("{id}")]
        public IActionResult DeleteFactura(int id)
        {
            try
            {
                var existingFactura = _facturaRepository.GetById(id);
                if (existingFactura == null) return NotFound();
                _facturaRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar factura: {ex.Message}");
            }
        }
    }
}