using System;
using System.Collections.Generic;

namespace PedidosAhorita.Server.Tablas
{
    public class Pedido
    {
        public int PedidoID { get; set; } // Clave Primaria (PK)
        public int ClienteID { get; set; } // FK a Clientes
        public int? VendedorID { get; set; } // FK a Vendedores (puede ser NULL si hay varios vendedores)
        public int? RepartidorID { get; set; } // FK a Empleados (puede ser NULL)
        public int EstadoDelPedidoID { get; set; } // FK a EstadosPedido
        public DateTime FechaDePedido { get; set; } // DATETIME DEFAULT GETDATE() en DB
        public DateTime? FechaEstimadaDeEntrega { get; set; } // DATETIME NULL en DB
        public DateTime? FechaDeEntregaReal { get; set; } // DATETIME NULL en DB
        public decimal Total { get; set; } // DECIMAL(10,2) NOT NULL en DB
        public string? TipoEntrega { get; set; } // NVARCHAR(50) NULL en DB
    }
}