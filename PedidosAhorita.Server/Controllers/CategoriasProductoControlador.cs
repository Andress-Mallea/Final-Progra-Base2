using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.Tablas.SQLModels;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasProductoControlador : ControllerBase
    {
        private readonly InterfasGenerica<CategoriaProducto> _categoriaProductoRepository;

        public CategoriasProductoControlador()
        {
            _categoriaProductoRepository = AlmacenDeDependecias.CategoriaProductoTabla;
        }

        // GET: api/CategoriasProducto
        [HttpGet]
        public ActionResult<List<CategoriaProducto>> GetCategoriasProducto()
        {
            var categorias = _categoriaProductoRepository.GetAll();
            return Ok(categorias);
        }

        // GET: api/CategoriasProducto/1
        [HttpGet("{id}")]
        public ActionResult<CategoriaProducto> GetCategoriaProducto(int id)
        {
            var categoria = _categoriaProductoRepository.GetById(id);
            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }

        // POST: api/CategoriasProducto
        [HttpPost]
        public ActionResult<CategoriaProducto> PostCategoriaProducto(CategoriaProducto categoria)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _categoriaProductoRepository.Add(categoria);
            return CreatedAtAction(nameof(GetCategoriaProducto), new { id = categoria.CategoriaID }, categoria);
        }

        // PUT: api/CategoriasProducto/1
        [HttpPut("{id}")]
        public IActionResult PutCategoriaProducto(int id, CategoriaProducto categoria)
        {
            if (id != categoria.CategoriaID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingCategoria = _categoriaProductoRepository.GetById(id);
                if (existingCategoria == null) return NotFound();
                _categoriaProductoRepository.Update(categoria);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating product category: {ex.Message}");
            }
        }

        // DELETE: api/CategoriasProducto/1
        [HttpDelete("{id}")]
        public IActionResult DeleteCategoriaProducto(int id)
        {
            try
            {
                var existingCategoria = _categoriaProductoRepository.GetById(id);
                if (existingCategoria == null) return NotFound();
                _categoriaProductoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting product category: {ex.Message}");
            }
        }
    }
}