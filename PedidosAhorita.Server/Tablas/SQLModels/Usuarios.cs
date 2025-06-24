using System;

namespace PedidosAhorita.Server.Tablas
{
    public class Usuarios
    {
        public int UsuarioID { get; set; } // Clave Primaria (PK)
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty; // UNIQUE NOT NULL en DB
        public string? Telefono { get; set; } // NVARCHAR(20) NULL en DB
        public string ContrasenaHash { get; set; } = string.Empty; // NVARCHAR(255) NOT NULL en DB
        public DateTime FechaDeRegistro { get; set; } // DATETIME DEFAULT GETDATE() en DB
        public bool Activo { get; set; } // BIT DEFAULT 1 en DB
    }
}