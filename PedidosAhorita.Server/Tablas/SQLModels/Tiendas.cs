using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Tiendas
    {
        public int VendedorID { get; set; } // Clave Primaria (PK) y FK a Usuarios
        public string NombreDeTienda { get; set; } = string.Empty; // NVARCHAR(100) NOT NULL en DB
        public string? CuentaDeBanco { get; set; } // NVARCHAR(100) NULL en DB
        public bool Activo { get; set; } // BIT DEFAULT 1 en DB
    }
}