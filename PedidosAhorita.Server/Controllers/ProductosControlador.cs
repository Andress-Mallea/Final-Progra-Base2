using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB;
using PedidosAhorita.Server.Tablas;
using PedidosAhorita.Server.Tablas.MongoDBModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using System;
using System.Data.SqlClient;
using PedidosAhorita.Server.DTOs;

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Esto mapea a /api/Productos
    public class ProductosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Producto> _productoRepositorySQL;
        private readonly InterfasGenericaM<ProductoDetalleMongo> _productoMongoRepository;
        private readonly InterfasGenericaM<Favoritos> _favoritosMongoRepository;
        public ProductosControlador()
        {
            _productoRepositorySQL = AlmacenDeDependecias.ProductoTabla;
            _productoMongoRepository = AlmacenDeDependecias.Mongo.GetRepository<ProductoDetalleMongo>("Productos");
            _favoritosMongoRepository = AlmacenDeDependecias.Mongo.GetRepository<Favoritos>("Favoritos"); // <-- Agrega esto
        }
        // GET: api/Productos
        // Obtiene todos los productos combinando datos de SQL Server y MongoDB
        [HttpGet]
        public ActionResult<List<Producto>> GetProductos()
        {
            try
            {
                var productosSQL = _productoRepositorySQL.GetAll();
                var productosCombinados = new List<RegistroProducto>();
                foreach (var prodSQL in productosSQL)
                {
                    var prodMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == prodSQL.ProductoID).FirstOrDefault();
                    if (prodMongo != null)
                    {
                        Console.WriteLine($"Coincidencia encontrada: ProductoID {prodSQL.ProductoID} tiene detalles en MongoDB (Imagen: {prodMongo.Imagen}, Descripcion: {prodMongo.Descripcion})");
                    }
                    else
                    {
                        Console.WriteLine($"Sin coincidencia en MongoDB para ProductoID {prodSQL.ProductoID}");
                    }
                    productosCombinados.Add(new RegistroProducto
                    {
                        ProductoID = prodSQL.ProductoID,
                        VendedorID = prodSQL.VendedorID,
                        Nombre = prodSQL.Nombre,
                        Precio = prodSQL.Precio,
                        StockDisponible = prodSQL.StockDisponible,
                        Activo = true,
                        FechaCreacion = DateTime.Now, // Asignar la fecha actual
                        Descripcion = prodMongo?.Descripcion,
                        Imagen = prodMongo?.Imagen
                    });
                }
                return Ok(productosCombinados);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener productos: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/Productos/5
        // Obtiene un producto por su ID, combinando datos de SQL Server y MongoDB
        [HttpGet("{id}")]
        public ActionResult<Producto> GetProducto(int id)
        {
            try
            {
                var productoSQL = _productoRepositorySQL.GetById(id);
                if (productoSQL == null)
                {
                    return NotFound();
                }

                var prodMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == productoSQL.ProductoID).FirstOrDefault();

                RegistroProducto productoCombinado = new RegistroProducto
                {
                    ProductoID = productoSQL.ProductoID,
                    VendedorID = productoSQL.VendedorID,
                    Nombre = productoSQL.Nombre,
                    Precio = productoSQL.Precio,
                    Cantidad = productoSQL.StockDisponible,
                    StockDisponible = productoSQL.StockDisponible,
                    Activo = true,
                    FechaCreacion = DateTime.Now,
                    Descripcion = prodMongo?.Descripcion,
                    Imagen = prodMongo?.Imagen
                };

                return Ok(productoCombinado);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener producto por ID: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Productos
        // Añade un nuevo producto a SQL Server y sus detalles a MongoDB
        [HttpPost]
        public ActionResult<Producto> PostProducto(RegistroProducto producto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var connectionString = AlmacenDeDependecias.SQL.ConnectionString;
                using (var connection = new SqlConnection(connectionString))
                using (var command = new SqlCommand("AgregarOActualizarProducto", connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@VendedorID", producto.VendedorID);
                    command.Parameters.AddWithValue("@Nombre", producto.Nombre);
                    command.Parameters.AddWithValue("@Precio", producto.Precio);
                    command.Parameters.AddWithValue("@Cantidad", (int)producto.Cantidad);

                    connection.Open();
                    try
                    {
                        command.ExecuteNonQuery();
                        Console.WriteLine($"Producto {producto.Nombre} agregado correctamente");
                    }
                    catch (SqlException ex)
                    {
                        // Si el procedimiento lanza RAISERROR, lo capturamos aquí
                        Console.WriteLine($"SQL Error al subir producto: {ex.Message}");
                        Console.WriteLine($"SQL StackTrace: {ex.StackTrace}");
                    }
                }

                if (producto.Descripcion != null || producto.Imagen != null)
                {
                    var productoMongo = new ProductoDetalleMongo
                    {
                        ProductoID = producto.ProductoID,
                        Nombre = producto.Nombre,
                        Precio = (double)producto.Precio,
                        Cantidad = (int)producto.Cantidad,
                        Descripcion = producto.Descripcion,
                        Imagen = producto.Imagen
                    };
                    _productoMongoRepository.InsertOne(productoMongo);
                }

                return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoID }, producto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear producto: {ex.Message}");
                return StatusCode(500, $"Error al crear producto: {ex.Message}");
            }
        }

        // PUT: api/Productos/101
        // Actualiza un producto en SQL Server y sus detalles en MongoDB
        [HttpPut("{id}")]
        public IActionResult PutProducto(int id, RegistroProducto producto)
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
                var existingProductSQL = _productoRepositorySQL.GetById(id);
                if (existingProductSQL == null) return NotFound();

                _productoRepositorySQL.Update(producto);

                var existingProductMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == id).FirstOrDefault();
                if (existingProductMongo != null)
                {
                    existingProductMongo.Nombre = producto.Nombre;
                    existingProductMongo.Precio = (double)producto.Precio;
                    existingProductMongo.Cantidad = producto.StockDisponible;
                    existingProductMongo.Descripcion = producto.Descripcion;
                    existingProductMongo.Imagen = producto.Imagen;
                    _productoMongoRepository.ReplaceOne(existingProductMongo);
                }
                else if (producto.Descripcion != null || producto.Imagen != null)
                {
                    _productoMongoRepository.InsertOne(new ProductoDetalleMongo
                    {
                        ProductoID = producto.ProductoID,
                        Nombre = producto.Nombre,
                        Precio = (double)producto.Precio,
                        Cantidad = producto.StockDisponible,
                        Descripcion = producto.Descripcion,
                        Imagen = producto.Imagen
                    });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar producto: {ex.Message}");
                return StatusCode(500, $"Error al actualizar producto: {ex.Message}");
            }
        }

        // DELETE: api/Productos/101
        // Elimina un producto de SQL Server y sus detalles de MongoDB
        [HttpDelete("{id}")]
        public IActionResult DeleteProducto(int id)
        {
            try
            {
                var existingProductSQL = _productoRepositorySQL.GetById(id);
                if (existingProductSQL == null) return NotFound();

                _productoRepositorySQL.Delete(id);

                _productoMongoRepository.DeleteOne(p => p.ProductoID == id);

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al eliminar producto: {ex.Message}");
                return StatusCode(500, $"Error al eliminar producto: {ex.Message}");
            }
        }

        // POST: api/Productos/realizar-compra
        [HttpPost("realizar-compra")]
        public IActionResult RealizarCompra([FromBody] RealizarCompraRequest request)
        {
            // --- Validación básica de entrada ---
            if (request == null)
            {
                return BadRequest("Los datos de la solicitud no pueden ser nulos.");
            }
            if (request.ClienteID <= 0 || request.ProductoID <= 0 || request.Cantidad <= 0)
            {
                return BadRequest("IDs de Cliente/Producto y Cantidad deben ser valores positivos.");
            }
            // Puedes añadir más validaciones aquí si es necesario

            try
            {
                var connectionString = AlmacenDeDependecias.SQL.ConnectionString;
                using (var connection = new SqlConnection(connectionString))
                using (var command = new SqlCommand("RealizarCompra", connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ClienteID", request.ClienteID);
                    command.Parameters.AddWithValue("@ProductoID", request.ProductoID);
                    command.Parameters.AddWithValue("@Cantidad", request.Cantidad);
                    command.Parameters.AddWithValue("@TipoEntrega", request.TipoEntrega);

                    connection.Open();
                    try
                    {
                        command.ExecuteNonQuery();
                        Console.WriteLine($"Comprado exitosamente");
                        return Ok(new { mensaje = "Compra realizada exitosamente." });
                    }
                    catch (SqlException ex)
                    {
                        // Si el procedimiento lanza RAISERROR, lo capturamos aquí
                        Console.WriteLine($"SQL Error al realizar compra: {ex.Message}");
                        Console.WriteLine($"SQL StackTrace: {ex.StackTrace}");
                        return Ok(new { error = "" }); // Retorna el mensaje de error del SQL Server
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error interno en RealizarCompra: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
        [HttpPost("agregar-favorito")]
public IActionResult AgregarFavorito([FromBody] Favoritos favorito)
{
    if (favorito == null || favorito.UsuarioID <= 0 || favorito.ProductoID <= 0)
        return BadRequest("Datos inválidos.");

    try
    {
        var yaExiste = _favoritosMongoRepository.FilterBy(f => f.UsuarioID == favorito.UsuarioID && f.ProductoID == favorito.ProductoID).Any();
        if (yaExiste)
            return Ok(new { mensaje = "El producto ya está en favoritos." });

        _favoritosMongoRepository.InsertOne(favorito);
        return Ok(new { mensaje = "Producto agregado a favoritos correctamente." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error interno: {ex.Message}");
    }
}
[HttpGet("favoritos/{usuarioId}")]
public IActionResult ObtenerFavoritos(int usuarioId)
{
    if (usuarioId <= 0)
        return BadRequest("UsuarioID inválido.");

    try
    {
        var favoritos = _favoritosMongoRepository.FilterBy(f => f.UsuarioID == usuarioId).ToList();
        return Ok(favoritos);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error interno: {ex.Message}");
    }
}
    }
}
