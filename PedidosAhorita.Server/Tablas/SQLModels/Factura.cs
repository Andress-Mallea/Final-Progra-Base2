using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas.SQLModels
{
    public class Factura
    {
        public int FacturaID { get; set; } // Clave Primaria (PK)
        public DateTime FechaDeEmision { get; set; } // DATETIME DEFAULT GETDATE() en DB
        public decimal MontoTotal { get; set; } // DECIMAL(10,2) NOT NULL en DB
        public string? URLFacturaPDF { get; set; } // NVARCHAR(255) NULL en DB

        // Tipo de factura: 'CLIENTE_COMPRA', 'VENDEDOR_LIQUIDACION', 'CLIENTE_NOTA_CREDITO'
        public string TipoDeFactura { get; set; } = string.Empty; // NVARCHAR(30) NOT NULL en DB

        public int? PedidoID { get; set; } // FK a Pedidos (NULLABLE)
        public int? PagoID { get; set; } // FK a Pagos (NULLABLE)

    }
}