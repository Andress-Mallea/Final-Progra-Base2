using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Contrasena { get; set; }
    }
}