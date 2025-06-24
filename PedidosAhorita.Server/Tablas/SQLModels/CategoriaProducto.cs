using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class CategoriaProducto
    {
        public int CategoriaID { get; set; } // Clave Primaria (PK)
        public string NombreCategoria { get; set; } = string.Empty; // NVARCHAR(100) UNIQUE NOT NULL en DB

    }
}