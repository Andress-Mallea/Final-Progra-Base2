namespace PedidosAhorita.Server.DTOs
{
    public class RealizarCompraRequest
    {
        public int ClienteID { get; set; }
        public int ProductoID { get; set; }
        public int Cantidad { get; set; }
        public string TipoEntrega { get; set; }
    }
}