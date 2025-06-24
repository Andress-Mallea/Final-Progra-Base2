using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas.SQLModels;


namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosDetallesPedidosControlador : ControllerBase
    {
         private readonly InterfasGenerica<PagosDetallePedido> _pagosDetallePedidoRepository;

        public PagosDetallesPedidosControlador()
        {
            _pagosDetallePedidoRepository = AlmacenDeDependecias.PagosDetallePedidoTabla;
        }

        // GET: api/PagosDetallePedidos
        [HttpGet]
        public ActionResult<List<PagosDetallePedido>> GetPagosDetallePedidos()
        {
            var pagosDetalle = _pagosDetallePedidoRepository.GetAll();
            return Ok(pagosDetalle);
        }

        // GET: api/PagosDetallePedidos/ByPago/1
        [HttpGet("ByPago/{pagoId}")]
        public ActionResult<List<PagosDetallePedido>> GetPagosDetalleByPago(int pagoId)
        {
            var allPagosDetalle = _pagosDetallePedidoRepository.GetAll();
            var pagosRelacionados = allPagosDetalle.Where(pd => pd.PagoID == pagoId).ToList();
            if (!pagosRelacionados.Any())
            {
                return NotFound($"No se encontraron detalles de pago para el PagoID {pagoId}.");
            }
            return Ok(pagosRelacionados);
        }

        // POST: api/PagosDetallePedidos
        [HttpPost]
        public ActionResult<PagosDetallePedido> PostPagosDetallePedido(PagosDetallePedido pagosDetalle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                // Opcional: Verificar unicidad de PagoID-PedidoID si tu GenericRepository no lo hace implícitamente
                // var existing = _pagosDetallePedidoRepository.GetAll().FirstOrDefault(pd => pd.PagoID == pagosDetalle.PagoID && pd.PedidoID == pagosDetalle.PedidoID);
                // if (existing != null) return Conflict("Esta asociación de pago-pedido ya existe.");

                _pagosDetallePedidoRepository.Add(pagosDetalle);
                return CreatedAtAction(nameof(GetPagosDetalleByPago), new { pagoId = pagosDetalle.PagoID }, pagosDetalle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al añadir detalle de pago: {ex.Message}");
            }
        }

        // PUT: api/PagosDetallePedidos/1 (asumiendo que PagosDetallePedidosID es la PK para Update)
        [HttpPut("{id}")]
        public IActionResult PutPagosDetallePedido(int id, PagosDetallePedido pagosDetalle)
        {
            if (id != pagosDetalle.PagosDetallePedidosID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingDetalle = _pagosDetallePedidoRepository.GetById(id);
                if (existingDetalle == null) return NotFound();
                _pagosDetallePedidoRepository.Update(pagosDetalle);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar detalle de pago: {ex.Message}");
            }
        }

        // DELETE: api/PagosDetallePedidos/1
        [HttpDelete("{id}")]
        public IActionResult DeletePagosDetallePedido(int id)
        {
            try
            {
                var existingDetalle = _pagosDetallePedidoRepository.GetById(id);
                if (existingDetalle == null) return NotFound();
                _pagosDetallePedidoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar detalle de pago: {ex.Message}");
            }
        }
    }
}