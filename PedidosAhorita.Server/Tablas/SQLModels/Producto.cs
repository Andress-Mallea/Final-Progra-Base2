using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PedidosAhorita.Server.Tablas
{
    public class Producto
    {
        public int ProductoID { get; set; }
        public int VendedorID { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int StockDisponible { get; set; }

    }
}