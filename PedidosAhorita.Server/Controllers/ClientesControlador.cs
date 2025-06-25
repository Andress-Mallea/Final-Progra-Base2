using System;
using System.Collections.Generic;
using System.Linq;
using PedidosAhorita.Server.Tablas; // Tus modelos SQL
using Microsoft.AspNetCore.Mvc;
using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesControlador : ControllerBase
    {
         private readonly InterfasGenerica<Cliente> _clienteRepository;

        public ClientesControlador()
        {
            _clienteRepository = AlmacenDeDependecias.ClienteTabla;
        }

        // GET: api/Clientes
        [HttpGet]
        public ActionResult<List<Cliente>> GetClientes()
        {
            var clientes = _clienteRepository.GetAll();
            return Ok(clientes);
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public ActionResult<Cliente> GetCliente(int id)
        {
            var cliente = _clienteRepository.GetById(id);
            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        // POST: api/Clientes
        // Nota: Para crear un Cliente, primero debes crear un Usuario.
        // Asume que el Usuario ya existe o lo creas aquí primero.
         [HttpPost]
        public ActionResult<Cliente> PostCliente(Cliente cliente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                
                _clienteRepository.Add(cliente);
                // No necesitas CreatedAtAction si solo estás añadiendo un cliente sin un GET posterior por ID del cliente
                return StatusCode(201, cliente); // Retorna 201 Created y el objeto cliente
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear cliente: {ex.Message}");
            }
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public IActionResult PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.ClienteID)
            {
                return BadRequest("El ID en la URL no coincide con el ID del cliente.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingCliente = _clienteRepository.GetById(id);
                if (existingCliente == null) return NotFound();

                _clienteRepository.Update(cliente);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar cliente: {ex.Message}");
            }
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public IActionResult DeleteCliente(int id)
        {
            try
            {
                var existingCliente = _clienteRepository.GetById(id);
                if (existingCliente == null) return NotFound();
                _clienteRepository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar cliente: {ex.Message}");
            }
        }
    }
}