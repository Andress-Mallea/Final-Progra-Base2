using PedidosAhorita.Server.BaseDeDatosConeccion.SQL;
using PedidosAhorita.Server.BaseDeDatosConeccion.MongoDB; // Importar el namespace de MongoDB
using PedidosAhorita.Server.Tablas; // Tus modelos SQL (incluye Producto)
using PedidosAhorita.Server.Tablas.MongoDBModels; // **Importante: Importa tu modelo ProductoDetalleMongo**
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using PedidosAhorita.Server.DTOs;
using System.Linq;
using MongoDB.Bson; // Necesario para tipos Bson, aunque no directamente usado en este controlador, es útil para MongoDB
using System; // Para Exception y Console.WriteLine, que son útiles para depuración

namespace PedidosAhorita.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Esto mapea a /api/Productos
    public class ProductosControlador : ControllerBase
    {
        private readonly InterfasGenerica<Producto> _productoRepositorySQL; // Repositorio para SQL Server
        // Usa tu InterfasGenericaM para el repositorio de MongoDB con el modelo de detalles de producto
        private readonly InterfasGenericaM<ProductoDetalleMongo> _productoMongoRepository; 

        public ProductosControlador()
        {
            // Obtiene la instancia del repositorio SQL desde el Service Locator (AlmacenDeDependecias)
            _productoRepositorySQL = AlmacenDeDependecias.ProductoTabla;
            // Obtiene el repositorio de MongoDB desde AlmacenDeDependecias.Mongo
            // "productos" es el nombre de la colección en MongoDB donde se guardarán los detalles adicionales.
            _productoMongoRepository = AlmacenDeDependecias.Mongo.GetRepository<ProductoDetalleMongo>("Productos"); 
        }

        // GET: api/Productos
        // Obtiene todos los productos combinando datos de SQL Server y MongoDB
        [HttpGet]
        public ActionResult<List<Producto>> GetProductos()
        {
            try
            {
                // Obtiene los productos base de SQL Server
                var productosSQL = _productoRepositorySQL.GetAll(); 

                var productosCombinados = new List<RegistroProducto>();
                foreach (var prodSQL in productosSQL)
                {
                    // Intenta buscar los detalles adicionales de este producto en MongoDB usando su ProductoID
                    var prodMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == prodSQL.ProductoID).FirstOrDefault();
                    if (prodMongo != null)
                    {
                        Console.WriteLine($"Coincidencia encontrada: ProductoID {prodSQL.ProductoID} tiene detalles en MongoDB (Imagen: {prodMongo.Imagen}, Descripcion: {prodMongo.Descripcion})");
                    }
                    else
                    {
                        Console.WriteLine($"Sin coincidencia en MongoDB para ProductoID {prodSQL.ProductoID}");
                    }
                    // Crea un nuevo objeto Producto que combine los campos de SQL Server y los de MongoDB
                    productosCombinados.Add(new RegistroProducto
                    {
                        ProductoID = prodSQL.ProductoID,
                        VendedorID = prodSQL.VendedorID,
                        Nombre = prodSQL.Nombre,
                        Precio = prodSQL.Precio,
                        Cantidad = prodSQL.StockDisponible, // Asumimos que 'Cantidad' viene de SQL Server para el stock
                        StockDisponible = prodSQL.StockDisponible, // Mantener si existe como campo diferente en SQL
                        Activo = true,
                        FechaCreacion = DateTime.UtcNow,
                        // Asigna Descripcion e Imagen desde MongoDB si se encontraron (usa el operador ?. para seguridad nula)
                        Descripcion = prodMongo?.Descripcion,
                        Imagen = prodMongo?.Imagen
                    });
                }
                return Ok(productosCombinados);
            }
            catch (Exception ex)
            {
                // Manejo de errores: loguea la excepción y retorna un error 500
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
                // Obtiene el producto base de SQL Server
                var productoSQL = _productoRepositorySQL.GetById(id);
                if (productoSQL == null)
                {
                    return NotFound(); // Retorna 404 si el producto no se encuentra en SQL
                }

                // Busca los detalles adicionales de este producto en MongoDB
                var prodMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == productoSQL.ProductoID).FirstOrDefault();

                // Crea un nuevo objeto Producto y combina los datos
                RegistroProducto productoCombinado = new RegistroProducto
                {
                    ProductoID = productoSQL.ProductoID,
                    VendedorID = productoSQL.VendedorID,
                    Nombre = productoSQL.Nombre,
                    Precio = productoSQL.Precio,
                    Cantidad = productoSQL.StockDisponible,
                    StockDisponible = productoSQL.StockDisponible,
                    Activo = true,

                    // Asigna Descripcion e Imagen desde MongoDB si se encontraron
                    Descripcion = prodMongo?.Descripcion,
                    Imagen = prodMongo?.Imagen
                };

                return Ok(productoCombinado);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                Console.WriteLine($"Error al obtener producto por ID: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
         [HttpGet("ByVendedor/{vendedorId}")]
        public ActionResult<List<Producto>> GetProductosByVendedorId(int vendedorId)
        {
            // Asumo que tu repositorio _productoRepository.GetAll() devuelve una lista
            // y que tu modelo Producto tiene una propiedad VendedorID
            var productosDelVendedor = _productoRepositorySQL.GetAll()
                                                         .Where(p => p.VendedorID == vendedorId)
                                                         .ToList();

            if (productosDelVendedor == null || !productosDelVendedor.Any())
            {
                return NotFound($"No se encontraron productos para el vendedor con ID {vendedorId}.");
            }

            return Ok(productosDelVendedor);
        }
        // POST: api/Productos
        // Añade un nuevo producto a SQL Server y sus detalles a MongoDB
        [HttpPost("agregar")]
        public IActionResult AgregarProducto([FromBody] ProductoConDetalleDto dto)
        {
            Console.WriteLine($"DTO recibido: Nombre={dto.Nombre}, Precio={dto.Precio}, VendedorID={dto.VendedorID}, Cantidad={dto.Cantidad}, StockDisponible={dto.StockDisponible}, Descripcion={dto.Descripcion}, Imagen={dto.Imagen}");
            try
            {
                // 1. Guardar en SQL Server
                var producto = new Producto
                {
                    Nombre = dto.Nombre,
                    Precio = dto.Precio,
                    VendedorID = dto.VendedorID,
                    StockDisponible = 1,
                };
                Console.WriteLine($"ProductoID generado: {dto.VendedorID}");
                AlmacenDeDependecias.ProductoTabla.Add(producto);
                Console.WriteLine($"ProductoID generado: {producto.ProductoID}");
                int productoID = producto.ProductoID; // Asumimos que ProductoID es auto-incremental y se asigna al añadir
                // 2. Guardar detalles en MongoDB
                var productoDetalle = new ProductoDetalleMongo
                {
                    ProductoID = productoID, // Usar el ID asignado por SQL Server
                    Nombre = dto.Nombre,
                    Precio = (double)dto.Precio,
                    Cantidad = 40,
                    Descripcion = dto.Descripcion,
                    Imagen = dto.Imagen
                };
                AlmacenDeDependecias.Mongo.GetRepository<ProductoDetalleMongo>("productos")
                    .InsertOne(productoDetalle);

                return Ok(new { mensaje = "Producto agregado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al agregar producto: {ex.Message}");
            }
        }

        // POST: api/Productos

// DTO para recibir datos del frontend
public class ProductoConDetalleDto
{
    public string Nombre { get; set; }
    public decimal Precio { get; set; }
    public int VendedorID { get; set; }
    public int Cantidad { get; set; }
    public int StockDisponible { get; set; }
    public string Descripcion { get; set; }
    public string Imagen { get; set; }
}
        [HttpPost]
        public ActionResult<Producto> PostProducto(RegistroProducto producto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna error si el modelo no es válido
            }
            try
            {
                // 1. Añade el producto a SQL Server (esto generará el ProductoID si es auto-increment)
                _productoRepositorySQL.Add(producto);

                // 2. Si el producto tiene Descripcion o Imagen, añade estos detalles a MongoDB
                if (producto.Descripcion != null || producto.Imagen != null)
                {
                    var productoMongo = new ProductoDetalleMongo
                    {
                        ProductoID = producto.ProductoID, // Usar el ID asignado por SQL Server
                        Nombre = producto.Nombre,
                        Precio = (double)producto.Precio,
                        Cantidad = (int)producto.Cantidad,
                        Descripcion = producto.Descripcion,
                        Imagen = producto.Imagen
                    };
                    _productoMongoRepository.InsertOne(productoMongo); // Inserta en la colección de MongoDB
                }

                // Retorna 201 Created con el producto recién creado
                return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoID }, producto);
            }
            catch (Exception ex)
            {
                // Manejo de errores
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
                // 1. Busca y actualiza el producto en SQL Server
                var existingProductSQL = _productoRepositorySQL.GetById(id);
                if (existingProductSQL == null) return NotFound(); // Producto no encontrado en SQL

                _productoRepositorySQL.Update(producto); // Actualiza el producto en SQL

                // 2. Actualiza o inserta los detalles del producto en MongoDB
                var existingProductMongo = _productoMongoRepository.FilterBy(p => p.ProductoID == id).FirstOrDefault();
                if (existingProductMongo != null)
                {
                    // Si el detalle existe en MongoDB, actualízalo
                    existingProductMongo.Nombre = producto.Nombre;
                    existingProductMongo.Precio = (double)producto.Precio;
                    existingProductMongo.Cantidad = producto.Cantidad;
                    existingProductMongo.Descripcion = producto.Descripcion;
                    existingProductMongo.Imagen = producto.Imagen;
                    _productoMongoRepository.ReplaceOne(existingProductMongo); // Reemplaza el documento en MongoDB
                }
                else if (producto.Descripcion != null || producto.Imagen != null)
                {
                    // Si no existía en MongoDB, pero el producto enviado tiene detalles, insértalos
                    _productoMongoRepository.InsertOne(new ProductoDetalleMongo
                    {
                        ProductoID = producto.ProductoID,
                        Nombre = producto.Nombre,
                        Precio = (double)producto.Precio,
                        Cantidad = producto.Cantidad,
                        Descripcion = producto.Descripcion,
                        Imagen = producto.Imagen
                    });
                }
                return NoContent(); // Retorna 204 No Content para una actualización exitosa
            }
            catch (Exception ex)
            {
                // Manejo de errores
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
                // 1. Busca el producto en SQL Server para confirmar que existe
                var existingProductSQL = _productoRepositorySQL.GetById(id);
                if (existingProductSQL == null) return NotFound(); // Producto no encontrado en SQL

                _productoRepositorySQL.Delete(id); // Elimina de SQL Server

                // 2. Elimina los detalles del producto de MongoDB
                _productoMongoRepository.DeleteOne(p => p.ProductoID == id); // Elimina el documento de MongoDB

                return NoContent(); // Retorna 204 No Content para una eliminación exitosa
            }
            catch (Exception ex)
            {
                // Manejo de errores
                Console.WriteLine($"Error al eliminar producto: {ex.Message}");
                return StatusCode(500, $"Error al eliminar producto: {ex.Message}");
            }
        }
    }
}
