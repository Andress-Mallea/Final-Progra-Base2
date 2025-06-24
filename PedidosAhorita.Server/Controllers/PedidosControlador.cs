using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Pedido> _pedidoRepository;

        public PedidosControlador()
        {
            _pedidoRepository = AlmacenDeDependecias.PedidoTabla;
        }

        // GET: api/Pedidos
        [HttpGet]
        public ActionResult<List<Pedido>> GetPedidos()
        {
            var pedidos = _pedidoRepository.GetAll();
            return Ok(pedidos);
        }

        // GET: api/Pedidos/5
        [HttpGet("{id}")]
        public ActionResult<Pedido> GetPedido(int id)
        {
            var pedido = _pedidoRepository.GetById(id);
            if (pedido == null)
            {
                return NotFound();
            }
            return Ok(pedido);
        }

        // POST: api/Pedidos
        [HttpPost]
        public ActionResult<Pedido> PostPedido(Pedido pedido)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _pedidoRepository.Add(pedido);
                return CreatedAtAction(nameof(GetPedido), new { id = pedido.PedidoID }, pedido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear pedido: {ex.Message}");
            }
        }

        // PUT: api/Pedidos/5
        [HttpPut("{id}")]
        public IActionResult PutPedido(int id, Pedido pedido)
        {
            if (id != pedido.PedidoID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingPedido = _pedidoRepository.GetById(id);
                if (existingPedido == null) return NotFound();
                _pedidoRepository.Update(pedido);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar pedido: {ex.Message}");
            }
        }

        // DELETE: api/Pedidos/5
        [HttpDelete("{id}")]
        public IActionResult DeletePedido(int id)
        {
            try
            {
                var existingPedido = _pedidoRepository.GetById(id);
                if (existingPedido == null) return NotFound();
                _pedidoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar pedido: {ex.Message}");
            }
        }
    }
}