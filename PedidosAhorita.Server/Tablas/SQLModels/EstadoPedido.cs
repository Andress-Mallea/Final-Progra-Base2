using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class EstadoPedido
    {
        public int EstadoID { get; set; } // Clave Primaria (PK)
        public string NombreEstado { get; set; } = string.Empty; // NVARCHAR(50) UNIQUE NOT NULL en DB

    }
}