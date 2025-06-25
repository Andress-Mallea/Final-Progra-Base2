using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Producto
    {
        public int ProductoID { get; set; } // Clave Primaria (PK)
        public int VendedorID { get; set; } // FK a Vendedores
        public int? CategoriaID { get; set; } // FK a CategoriasProducto, NULLable
        public string Nombre { get; set; } = string.Empty; // NVARCHAR(100) NOT NULL en DB
        public string? Descripcion { get; set; } // NVARCHAR(MAX) NULL en DB
        public decimal Precio { get; set; } // DECIMAL(10,2) NOT NULL en DB
        public int StockDisponible { get; set; } // INT NOT NULL DEFAULT 0 en DB
        public string? ImagenURL { get; set; } // NVARCHAR(255) NULL en DB
        public DateTime FechaCreacion { get; set; } // DATETIME DEFAULT GETDATE() en DB
        public bool Activo { get; set; } // BIT DEFAULT 1 en DB
        public int Cantidad { get; set; } // Opcional, para compatibilidad con Mongo
        public string? Imagen { get; set; } // Opcional, para compatibilidad con Mongo

    }
}