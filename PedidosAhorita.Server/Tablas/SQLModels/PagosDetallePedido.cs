using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class PagosDetallePedido
    {
        public int PagosDetallePedidosID { get; set; } // Clave Primaria (PK)
        public int PagoID { get; set; } // FK a Pagos
        public int PedidoID { get; set; } // FK a Pedidos
        public decimal MontoCorrespondiente { get; set; } // Monto del pedido cubierto por este pago (DECIMAL(10,2) NOT NULL)

    }
}