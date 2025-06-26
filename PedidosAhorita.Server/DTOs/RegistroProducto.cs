using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PedidosAhorita.Server.Tablas;
namespace PedidosAhorita.Server.DTOs
{
    public class RegistroProducto : Producto
    {
        public int Cantidad { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string? Descripcion { get; set; }
        public string? Imagen { get; set; }
    }
}