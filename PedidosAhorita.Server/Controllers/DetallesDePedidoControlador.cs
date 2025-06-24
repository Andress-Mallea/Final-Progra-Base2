using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas.SQLModels;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetallesDePedidoControlador : ControllerBase
    {
        private readonly InterfasGenerica<DetalleDePedido> _detalleDePedidoRepository;

        public DetallesDePedidoControlador()
        {
            _detalleDePedidoRepository = AlmacenDeDependecias.DetalleDePedidoTabla;
        }

        // GET: api/DetallesDePedido
        [HttpGet]
        public ActionResult<List<DetalleDePedido>> GetDetallesDePedido()
        {
            var detalles = _detalleDePedidoRepository.GetAll();
            return Ok(detalles);
        }

        // GET: api/DetallesDePedido/ByPedido/5
        [HttpGet("ByPedido/{pedidoId}")]
        public ActionResult<List<DetalleDePedido>> GetDetallesByPedido(int pedidoId)
        {
            // Filtramos en memoria, esto puede ser ineficiente para grandes conjuntos de datos
            var allDetalles = _detalleDePedidoRepository.GetAll();
            var detallesDePedido = allDetalles.Where(dp => dp.PedidoID == pedidoId).ToList();
            if (!detallesDePedido.Any())
            {
                return NotFound($"No se encontraron detalles para el PedidoID {pedidoId}.");
            }
            return Ok(detallesDePedido);
        }

        // POST: api/DetallesDePedido
        [HttpPost]
        public ActionResult PostDetalleDePedido(DetalleDePedido detalle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                // Verifica si el detalle ya existe (evitar duplicados por PK compuesta)
                var existing = _detalleDePedidoRepository.GetAll()
                                   .FirstOrDefault(d => d.PedidoID == detalle.PedidoID && d.ProductoID == detalle.ProductoID);
                if (existing != null)
                {
                    return Conflict("Este detalle de pedido para este producto ya existe.");
                }

                _detalleDePedidoRepository.Add(detalle);
                // No hay un GetById simple para PK compuesta. Podrías devolver el objeto creado o 201.
                return CreatedAtAction(nameof(GetDetallesByPedido), new { pedidoId = detalle.PedidoID }, detalle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al añadir detalle de pedido: {ex.Message}");
            }
        }

        // PUT: api/DetallesDePedido
        // La actualización de detalles de pedido por PK compuesta es más compleja sin soporte directo del GenericRepository.
        // Asumimos que se busca por la PK compuesta y se actualiza todo el objeto.
        [HttpPut]
        public IActionResult PutDetalleDePedido(DetalleDePedido detalle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Buscar el detalle por la clave compuesta. Si no existe, es un 404.
                var existingDetalle = _detalleDePedidoRepository.GetAll()
                                        .FirstOrDefault(d => d.PedidoID == detalle.PedidoID && d.ProductoID == detalle.ProductoID);
                if (existingDetalle == null)
                {
                    return NotFound($"Detalle de pedido para PedidoID {detalle.PedidoID} y ProductoID {detalle.ProductoID} no encontrado.");
                }

                // El Update del GenericRepository usa un ID simple.
                // Esto requeriría una sobrecarga o un método específico en el repositorio
                // para actualizar basado en una clave compuesta.
                // Aquí, para cumplir con el requisito de no usar Tasks y DI,
                // si no adaptamos GenericRepository, esto sería un reto.

                // Si `Update` en GenericRepository fuera lo suficientemente inteligente para
                // tomar un objeto y usar su PK (compuesta o simple) para el WHERE clause:
                _detalleDePedidoRepository.Update(detalle);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar detalle de pedido: {ex.Message}");
            }
        }

        // DELETE: api/DetallesDePedido/DeleteSpecific?pedidoId=5&productoId=10
        [HttpDelete("DeleteSpecific")]
        public IActionResult DeleteDetalleDePedido(int pedidoId, int productoId)
        {
            // Similar al PUT, Delete(int id) del GenericRepository no funcionará directamente.
            // Se necesita un método específico en el repositorio para eliminar por clave compuesta.
            try
            {
                 var existingDetalle = _detalleDePedidoRepository.GetAll()
                                        .FirstOrDefault(d => d.PedidoID == pedidoId && d.ProductoID == productoId);
                if (existingDetalle == null)
                {
                    return NotFound($"Detalle de pedido para PedidoID {pedidoId} y ProductoID {productoId} no encontrado.");
                }

                // Aquí deberías llamar a un método en tu repositorio que sepa cómo eliminar por clave compuesta
                // Ejemplo hipotético: _detalleDePedidoRepository.DeleteByCompositeKey(pedidoId, productoId);
                return BadRequest("La eliminación por clave compuesta requiere un método específico en el repositorio.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar detalle de pedido: {ex.Message}");
            }
        }
    }
}