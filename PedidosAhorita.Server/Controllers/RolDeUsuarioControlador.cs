using System;
using System.Collections.Generic;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.Tablas.SQLModels;
namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesDeUsuarioController : ControllerBase
    {
        private readonly InterfasGenerica<RolDeUsuario> _rolDeUsuarioRepository;

        public RolesDeUsuarioController()
        {
            _rolDeUsuarioRepository = AlmacenDeDependecias.RolDeUsuarioTabla;
        }

        // GET: api/RolesDeUsuario
        [HttpGet]
        public ActionResult<List<RolDeUsuario>> GetRolesDeUsuario()
        {
            var roles = _rolDeUsuarioRepository.GetAll();
            return Ok(roles);
        }

        // GET: api/RolesDeUsuario/1
        [HttpGet("{id}")]
        public ActionResult<RolDeUsuario> GetRolDeUsuario(int id)
        {
            var rol = _rolDeUsuarioRepository.GetById(id);
            if (rol == null)
            {
                return NotFound();
            }
            return Ok(rol);
        }

        // POST: api/RolesDeUsuario
        [HttpPost]
        public ActionResult<RolDeUsuario> PostRolDeUsuario(RolDeUsuario rol)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _rolDeUsuarioRepository.Add(rol);
            return CreatedAtAction(nameof(GetRolDeUsuario), new { id = rol.RolID }, rol);
        }

        // PUT: api/RolesDeUsuario/1
        [HttpPut("{id}")]
        public IActionResult PutRolDeUsuario(int id, RolDeUsuario rol)
        {
            if (id != rol.RolID)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingRol = _rolDeUsuarioRepository.GetById(id);
                if (existingRol == null) return NotFound();
                _rolDeUsuarioRepository.Update(rol);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating role: {ex.Message}");
            }
        }

        // DELETE: api/RolesDeUsuario/1
        [HttpDelete("{id}")]
        public IActionResult DeleteRolDeUsuario(int id)
        {
            try
            {
                var existingRol = _rolDeUsuarioRepository.GetById(id);
                if (existingRol == null) return NotFound();
                _rolDeUsuarioRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting role: {ex.Message}");
            }
        }
    }
}