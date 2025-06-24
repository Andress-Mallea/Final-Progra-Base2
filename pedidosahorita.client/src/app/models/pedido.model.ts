export interface Pedido {
  PedidoID: number;             // Clave Primaria (PK) del pedido
  ClienteID: number;            // Clave foránea a Clientes
  VendedorID?: number;          // Clave foránea opcional a Vendedores
  RepartidorID?: number;        // Clave foránea opcional a Empleados (repartidores)
  EstadoDelPedidoID: number;    // Clave foránea a EstadosPedido
  FechaDePedido: Date;          // Fecha y hora en que se realizó el pedido
  FechaEstimadaDeEntrega?: Date; // Fecha estimada de entrega
  FechaDeEntregaReal?: Date;     // Fecha real de entrega
  Total: number;                // Monto total del pedido
  TipoEntrega?: string;         // Tipo de entrega (ej. "A domicilio", "Recogida en tienda")
}