using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.Tablas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PedidosAhorita.Server.DTOs;
namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpPost("registrar-completo")]
        public IActionResult RegistrarCompleto([FromBody] RegistroDeUsuario.RegistroUsuarioCompletoDto dto)
        {
            try
            {
                // 1. Crear usuario
                var usuario = new Usuarios
                {
                    Nombre = dto.Nombre,
                    Apellido = dto.Apellido,
                    Email = dto.Email,
                    ContrasenaHash = dto.Contrasena,
                    FechaDeRegistro = DateTime.Now,
                    Activo = true
                };
                int usuarioId = AlmacenDeDependecias.UsuariosTabla.AddID(usuario);

                // 2. Según el tipo, crear entidad específica
                if (dto.Tipo == "Cliente")
                {
                    var cliente = new Cliente
                    {
                        ClienteID = usuarioId,
                        Direccion = dto.Direccion,
                        Ciudad = dto.Ciudad,
                        CodigoPostal = dto.CodigoPostal
                    };
                    Console.WriteLine($"Usuario creado con ID: {usuarioId}");
                    AlmacenDeDependecias.ClienteTabla.Add(cliente);
                }
                else if (dto.Tipo == "Vendedor")
                {
                    var vendedor = new Tiendas
                    {
                        VendedorID = usuarioId,
                        NombreDeTienda = dto.NombreDeTienda,
                        CuentaDeBanco = dto.CuentaDeBanco,
                        Activo = true,
                    };
                    AlmacenDeDependecias.TiendasTabla.Add(vendedor);
                }

                return Ok(usuarioId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al registrar usuario: {ex.Message}");
            }
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            try
            {
                // 1. Buscar usuario por email y contraseña
                var usuario = AlmacenDeDependecias.UsuariosTabla.GetAll()
                    .FirstOrDefault(u => u.Email == dto.Email && u.ContrasenaHash == dto.Contrasena);

                if (usuario == null) { 
                    Console.WriteLine($"Usuario no encontrado o contraseña incorrecta para email: {dto.Email}");
                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos." });
                    }
                // 2. Buscar roles del usuario
                var UsuarioRol = AlmacenDeDependecias.UsuarioRolTabla.GetAll()
                    .Where(ur => ur.UsuarioID == usuario.UsuarioID)
                    .ToList();

                // 3. Obtener el rol principal (prioridad: Vendedor > Empleado > Cliente)
                var roles = AlmacenDeDependecias.RolDeUsuarioTabla.GetAll()
                    .Where(r => UsuarioRol.Any(ur => ur.RolID == r.RolID))
                    .ToList();

                string userType = roles.Any(r => r.NombreRol == "Vendedor") ? "Vendedor"
                                : roles.Any(r => r.NombreRol == "Empleado") ? "Empleado"
                                : roles.Any(r => r.NombreRol == "Cliente") ? "Cliente"
                                : "Usuario";

                // 4. Obtener datos extra según el tipo
                object datosExtra = null;
                if (userType == "Cliente")
                {
                    datosExtra = AlmacenDeDependecias.ClienteTabla.GetAll()
                        .FirstOrDefault(c => c.ClienteID == usuario.UsuarioID);
                }
                else if (userType == "Empleado")
                {
                    datosExtra = AlmacenDeDependecias.EmpleadoTabla.GetAll()
                        .FirstOrDefault(e => e.EmpleadoID == usuario.UsuarioID);
                }
                else if (userType == "Vendedor")
                {
                    datosExtra = AlmacenDeDependecias.TiendasTabla.GetAll()
                        .FirstOrDefault(t => t.VendedorID == usuario.UsuarioID);
                }

                // 5. Armar respuesta
                var usuarioCompleto = new
                {
                    UsuarioID = usuario.UsuarioID,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Email = usuario.Email,
                    userType = userType,
                    // Incluye los datos extra según el tipo
                    datosExtra
                };

                return Ok(new { usuario = usuarioCompleto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al iniciar sesión: {ex.Message}");
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