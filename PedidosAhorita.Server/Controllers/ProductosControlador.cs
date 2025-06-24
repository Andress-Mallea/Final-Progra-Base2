using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Producto> _productoRepository;

        public ProductosControlador()
        {
            // Obtiene la instancia del repositorio desde el Service Locator
            _productoRepository = AlmacenDeDependecias.ProductoTabla;
        }

        // GET: api/Productos
        [HttpGet]
        public ActionResult<List<Producto>> GetProductos()
        {
            var productos = _productoRepository.GetAll();
            return Ok(productos);
        }

        // GET: api/Productos/101
        [HttpGet("{id}")]
        public ActionResult<Producto> GetProducto(int id)
        {
            var producto = _productoRepository.GetById(id);
            if (producto == null)
            {
                return NotFound();
            }
            return Ok(producto);
        }

        // POST: api/Productos
        [HttpPost]
        public ActionResult<Producto> PostProducto(Producto producto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _productoRepository.Add(producto);
                return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoID }, producto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear producto: {ex.Message}");
            }
        }

        // PUT: api/Productos/101
        [HttpPut("{id}")]
        public IActionResult PutProducto(int id, Producto producto)
        {
            if (id != producto.ProductoID)
            {
                return BadRequest("El ID en la URL no coincide con el ID del producto.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingProduct = _productoRepository.GetById(id);
                if (existingProduct == null) return NotFound();
                _productoRepository.Update(producto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar producto: {ex.Message}");
            }
        }

        // DELETE: api/Productos/101
        [HttpDelete("{id}")]
        public IActionResult DeleteProducto(int id)
        {
            try
            {
                var existingProduct = _productoRepository.GetById(id);
                if (existingProduct == null) return NotFound();
                _productoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar producto: {ex.Message}");
            }
        }
    }
}