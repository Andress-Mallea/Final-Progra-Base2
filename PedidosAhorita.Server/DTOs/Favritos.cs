using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PedidosAhorita.Server.Tablas;
namespace PedidosAhorita.Server.DTOs
{
    public class Favoritos : Producto
    {
        public int UsuarioID { get; set; } 
        public string? Descripcion { get; set; }
    }
}