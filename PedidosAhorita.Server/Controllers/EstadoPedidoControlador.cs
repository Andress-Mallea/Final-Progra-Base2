using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas.SQLModels;
namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadoPedidoControlador : ControllerBase
    {
        private readonly InterfasGenerica<EstadoPedido> _estadoPedidoRepository;

        public EstadoPedidoControlador()
        {
            _estadoPedidoRepository = AlmacenDeDependecias.EstadoPedidoTabla;
        }

        // GET: api/EstadosPedido
        [HttpGet]
        public ActionResult<List<EstadoPedido>> GetEstadosPedido()
        {
            var estados = _estadoPedidoRepository.GetAll();
            return Ok(estados);
        }

        // GET: api/EstadosPedido/1
        [HttpGet("{id}")]
        public ActionResult<EstadoPedido> GetEstadoPedido(int id)
        {
            var estado = _estadoPedidoRepository.GetById(id);
            if (estado == null)
            {
                return NotFound();
            }
            return Ok(estado);
        }

        // POST: api/EstadosPedido
        [HttpPost]
        public ActionResult<EstadoPedido> PostEstadoPedido(EstadoPedido estado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _estadoPedidoRepository.Add(estado);
            return CreatedAtAction(nameof(GetEstadoPedido), new { id = estado.EstadoID }, estado);
        }

        // PUT: api/EstadosPedido/1
        [HttpPut("{id}")]
        public IActionResult PutEstadoPedido(int id, EstadoPedido estado)
        {
            if (id != estado.EstadoID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingEstado = _estadoPedidoRepository.GetById(id);
                if (existingEstado == null) return NotFound();
                _estadoPedidoRepository.Update(estado);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating order status: {ex.Message}");
            }
        }

        // DELETE: api/EstadosPedido/1
        [HttpDelete("{id}")]
        public IActionResult DeleteEstadoPedido(int id)
        {
            try
            {
                var existingEstado = _estadoPedidoRepository.GetById(id);
                if (existingEstado == null) return NotFound();
                _estadoPedidoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting order status: {ex.Message}");
            }
        }
    }
}