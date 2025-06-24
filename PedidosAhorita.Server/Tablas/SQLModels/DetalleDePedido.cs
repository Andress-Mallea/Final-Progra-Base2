using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class DetalleDePedido
    {
        public int PedidoID { get; set; } // Parte de la PK compuesta y FK a Pedidos
        public int ProductoID { get; set; } // Parte de la PK compuesta y FK a Productos
        public int Cantidad { get; set; } // INT NOT NULL en DB
        public decimal PrecioUnitario { get; set; } // DECIMAL(10,2) NOT NULL en DB

    }
}