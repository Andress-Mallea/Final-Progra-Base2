using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Cliente
    {
        public int ClienteID { get; set; } // Clave Primaria (PK) y FK a Usuarios
        public string? Direccion { get; set; } // NVARCHAR(255) NULL en DB
        public string? Ciudad { get; set; } // NVARCHAR(100) NULL en DB
        public string? CodigoPostal { get; set; } // NVARCHAR(10) NULL en DB
    }
}