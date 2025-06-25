using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Empleado> _empleadoRepository;

        public EmpleadosControlador()
        {
            _empleadoRepository = AlmacenDeDependecias.EmpleadoTabla;
        }

        // GET: api/Empleados
        [HttpGet]
        public ActionResult<List<Empleado>> GetEmpleados()
        {
            var empleados = _empleadoRepository.GetAll();
            return Ok(empleados);
        }

        // GET: api/Empleados/5
        [HttpGet("{id}")]
        public ActionResult<Empleado> GetEmpleado(int id)
        {
            var empleado = _empleadoRepository.GetById(id);
            if (empleado == null)
            {
                return NotFound();
            }
            return Ok(empleado);
        }

        // POST: api/Empleados
        [HttpPost]
        public ActionResult<Empleado> PostEmpleado(Empleado empleado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _empleadoRepository.Add(empleado);
                // No necesitas CreatedAtAction si solo estás añadiendo un empleado sin un GET posterior por ID del empleado
                return StatusCode(201, empleado); // Retorna 201 Created y el objeto empleado
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear empleado: {ex.Message}");
            }
        }

        // PUT: api/Empleados/5
        [HttpPut("{id}")]
        public IActionResult PutEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.EmpleadoID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingEmpleado = _empleadoRepository.GetById(id);
                if (existingEmpleado == null) return NotFound();
                _empleadoRepository.Update(empleado);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar empleado: {ex.Message}");
            }
        }

        // DELETE: api/Empleados/5
        [HttpDelete("{id}")]
        public IActionResult DeleteEmpleado(int id)
        {
            try
            {
                var existingEmpleado = _empleadoRepository.GetById(id);
                if (existingEmpleado == null) return NotFound();
                _empleadoRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar empleado: {ex.Message}");
            }
        }
    }
}