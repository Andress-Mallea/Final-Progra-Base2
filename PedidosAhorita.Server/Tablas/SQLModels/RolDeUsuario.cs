using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class RolDeUsuario
    {
        public int RolID { get; set; } // Clave Primaria (PK)
        public string NombreRol { get; set; } = string.Empty; // NVARCHAR(50) UNIQUE NOT NULL en DB

    }
}