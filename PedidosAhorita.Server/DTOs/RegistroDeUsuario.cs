using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.DTOs
{
    public class RegistroDeUsuario
    {
        public class RegistroUsuarioCompletoDto
{
    public string Tipo { get; set; } // "Cliente", "Empleado", "Vendedor"
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public string Contrasena { get; set; }
    // Cliente
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    // Empleado
    public DateTime? FechaDeContratacion { get; set; }
    public string? RolInterno { get; set; }
    public decimal? Salario { get; set; }
    // Vendedor
    public string? NombreDeTienda { get; set; }
    public string? CuentaDeBanco { get; set; }
}
    }
}