using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosControlador : Controller
    {
        private readonly InterfasGenerica<Usuarios> _usuarioRepository;

        public UsuariosControlador()
        {
            // Obtiene la instancia del repositorio desde el Service Locator
            _usuarioRepository = AlmacenDeDependecias.UsuariosTabla;
        }

        // GET: api/Usuarios
        [HttpGet]
        public ActionResult<List<Usuarios>> GetUsuarios()
        {
            var usuarios = _usuarioRepository.GetAll(); // Operación síncrona
            return Ok(usuarios); // Retorna 200 OK con la lista de usuarios
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public ActionResult<Usuarios> GetUsuario(int id)
        {
            var usuario = _usuarioRepository.GetById(id); // Operación síncrona
            if (usuario == null)
            {
                return NotFound(); // Retorna 404 Not Found si el usuario no existe
            }
            return Ok(usuario); // Retorna 200 OK con el usuario encontrado
        }

        // POST: api/Usuarios
        [HttpPost]
        public ActionResult<Usuarios> PostUsuario(Usuarios usuario)
        {
            // Validaciones básicas (puedes añadir más si es necesario)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna 400 Bad Request si el modelo es inválido
            }

            _usuarioRepository.Add(usuario); // Operación síncrona

            // Si UsuarioID es una columna IDENTITY en tu DB y no se asignó en el Add,
            // no lo tendrás aquí automáticamente. En un escenario real, necesitarías
            // una forma de recuperar el ID generado (ej. modificando Add para que devuelva el ID).
            // Para fines de esta demostración, asumimos que el ID ya está en el objeto
            // o que no lo necesitas para el CreatedAtAction.
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioID }, usuario);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        public IActionResult PutUsuario(int id, Usuarios usuario)
        {
            if (id != usuario.UsuarioID)
            {
                return BadRequest("El ID en la URL no coincide con el ID del usuario."); // Retorna 400
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Verifica si el usuario realmente existe antes de intentar actualizar
                var existingUser = _usuarioRepository.GetById(id);
                if (existingUser == null)
                {
                    return NotFound($"Usuario con ID {id} no encontrado.");
                }

                _usuarioRepository.Update(usuario); // Operación síncrona
                return NoContent(); // Retorna 204 No Content para una actualización exitosa sin contenido de respuesta
            }
            catch (Exception ex)
            {
                // Manejo de errores más específico si es necesario
                return StatusCode(500, $"Error interno del servidor al actualizar el usuario: {ex.Message}");
            }
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUsuario(int id)
        {
            try
            {
                var existingUser = _usuarioRepository.GetById(id);
                if (existingUser == null)
                {
                    return NotFound($"Usuario con ID {id} no encontrado.");
                }

                _usuarioRepository.Delete(id); // Operación síncrona
                return NoContent(); // Retorna 204 No Content para una eliminación exitosa
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor al eliminar el usuario: {ex.Message}");
            }
        }
    }
}