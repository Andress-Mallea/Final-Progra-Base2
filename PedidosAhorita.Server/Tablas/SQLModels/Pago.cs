using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Pago
    {
        public int PagoID { get; set; } // Clave Primaria (PK)
        public decimal Monto { get; set; } // DECIMAL(10,2) NOT NULL en DB
        public string? MetodoDePago { get; set; } // NVARCHAR(50) NULL en DB
        public string? NumeroTransaccion { get; set; } // NVARCHAR(100) NULL en DB
        public DateTime FechaDePago { get; set; } // DATETIME DEFAULT GETDATE() en DB
        public string? EstadoDePago { get; set; } // NVARCHAR(20) NULL en DB

        // Tipo de transacción: 'CLIENTE_PAGO_PEDIDO', 'PLATAFORMA_PAGO_VENDEDOR', 'CLIENTE_REEMBOLSO'
        public string TipoDeTransaccion { get; set; } = string.Empty; // NVARCHAR(30) NOT NULL en DB

        public int? PedidoID { get; set; } // FK a Pedidos (NULLABLE)
        public int? VendedorID { get; set; } // FK a Vendedores (NULLABLE)

        public DateTime? PeriodoDesde { get; set; } // DATE NULL en DB (usado para pagos a vendedores)
        public DateTime? PeriodoHasta { get; set; } // DATE NULL en DB (usado para pagos a vendedores)

    }
}