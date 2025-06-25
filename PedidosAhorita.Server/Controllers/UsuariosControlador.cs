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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (usuario.FechaDeRegistro < new DateTime(1753, 1, 1)|| usuario.FechaDeRegistro == null)
                {
                    // Asegúrate de que la fecha de registro sea válida
                    Console.WriteLine("Fecha de registro inválida, estableciendo a la fecha actual.");
                    usuario.FechaDeRegistro = DateTime.Now;
                }
                Console.WriteLine($"Creando usuario: {usuario.UsuarioID}, {usuario.Nombre}, {usuario.Email}");
                _usuarioRepository.Add(usuario);
                // No necesitas CreatedAtAction si solo estás añadiendo un usuario sin un GET posterior por ID del usuario
                return StatusCode(201, usuario); // Retorna 201 Created y el objeto usuario
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear usuario: {ex.Message}");
                return StatusCode(500, $"Error al crear usuario: {ex.Message}");
            }
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