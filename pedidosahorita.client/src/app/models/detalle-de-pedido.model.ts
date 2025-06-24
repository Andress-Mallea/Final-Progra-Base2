export interface DetalleDePedido {
  PedidoID: number;      // Parte de la clave primaria compuesta y clave foránea a Pedidos
  ProductoID: number;    // Parte de la clave primaria compuesta y clave foránea a Productos
  Cantidad: number;      // Cantidad del producto en este detalle de pedido
  PrecioUnitario: number; // Precio unitario del producto en el momento de la compra
}
