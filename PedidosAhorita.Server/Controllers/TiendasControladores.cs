using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.Tablas.SQLModels;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiendasControladores : ControllerBase
    {
        private readonly InterfasGenerica<Tiendas> _tiendaRepository;

        public TiendasControladores()
        {
            _tiendaRepository = AlmacenDeDependecias.TiendasTabla;
        }

        // GET: api/Tiendas
        [HttpGet]
        public ActionResult<List<Tiendas>> GetTiendas()
        {
            var tiendas = _tiendaRepository.GetAll();
            return Ok(tiendas);
        }

        // GET: api/Tiendas/5
        [HttpGet("{id}")]
        public ActionResult<Tiendas> GetTienda(int id)
        {
            var tienda = _tiendaRepository.GetById(id);
            if (tienda == null)
            {
                return NotFound();
            }
            return Ok(tienda);
        }

        // POST: api/Tiendas
        [HttpPost]
        public ActionResult<Tiendas> PostTienda(Tiendas tienda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                // Similar a Clientes, VendedorID debe ser un UsuarioID existente.
                _tiendaRepository.Add(tienda);
                return CreatedAtAction(nameof(GetTienda), new { id = tienda.VendedorID }, tienda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear tienda: {ex.Message}");
            }
        }

        // PUT: api/Tiendas/5
        [HttpPut("{id}")]
        public IActionResult PutTienda(int id, Tiendas tienda)
        {
            if (id != tienda.VendedorID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingTienda = _tiendaRepository.GetById(id);
                if (existingTienda == null) return NotFound();
                _tiendaRepository.Update(tienda);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar tienda: {ex.Message}");
            }
        }

        // DELETE: api/Tiendas/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTienda(int id)
        {
            try
            {
                var existingTienda = _tiendaRepository.GetById(id);
                if (existingTienda == null) return NotFound();
                _tiendaRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar tienda: {ex.Message}");
            }
        }
    }
}