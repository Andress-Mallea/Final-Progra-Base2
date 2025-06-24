using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class UsuarioRol
    {
        public int UsuarioID { get; set; } // Parte de la PK y FK a Usuarios
        public int RolID { get; set; } // Parte de la PK y FK a RolesDeUsuario
    }
}