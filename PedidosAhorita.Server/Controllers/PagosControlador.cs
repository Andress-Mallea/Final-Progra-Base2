using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas.SQLModels;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Pago> _pagoRepository;

        public PagosControlador()
        {
            _pagoRepository = AlmacenDeDependecias.PagoTabla;
        }

        // GET: api/Pagos
        [HttpGet]
        public ActionResult<List<Pago>> GetPagos()
        {
            var pagos = _pagoRepository.GetAll();
            return Ok(pagos);
        }

        // GET: api/Pagos/1
        [HttpGet("{id}")]
        public ActionResult<Pago> GetPago(int id)
        {
            var pago = _pagoRepository.GetById(id);
            if (pago == null)
            {
                return NotFound();
            }
            return Ok(pago);
        }

        // POST: api/Pagos
        [HttpPost]
        public ActionResult<Pago> PostPago(Pago pago)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _pagoRepository.Add(pago);
                return CreatedAtAction(nameof(GetPago), new { id = pago.PagoID }, pago);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear pago: {ex.Message}");
            }
        }

        // PUT: api/Pagos/1
        [HttpPut("{id}")]
        public IActionResult PutPago(int id, Pago pago)
        {
            if (id != pago.PagoID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingPago = _pagoRepository.GetById(id);
                if (existingPago == null) return NotFound();
                _pagoRepository.Update(pago);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar pago: {ex.Message}");
            }
        }

        // DELETE: api/Pagos/1
        [HttpDelete("{id}")]
        public IActionResult DeletePago(int id)
        {
            try
            {
                var existingPago = _pagoRepository.GetById(id);
                if (existingPago == null) return NotFound();
                _pagoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar pago: {ex.Message}");
            }
        }

    }
}