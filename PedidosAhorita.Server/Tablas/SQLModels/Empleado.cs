using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Empleado 
    {
        public int EmpleadoID { get; set; } // Clave Primaria (PK) y FK a Usuarios
        public DateTime FechaDeContratacion { get; set; } // DATE NOT NULL en DB
        public DateTime? FechaDeDespido { get; set; } // DATE NULL en DB
        public string? RolInterno { get; set; } // NVARCHAR(50) NULL en DB (cambiado de Rol para evitar conflictos)
        public decimal? Salario { get; set; } // DECIMAL(10,2) NULL en DB
    }
}