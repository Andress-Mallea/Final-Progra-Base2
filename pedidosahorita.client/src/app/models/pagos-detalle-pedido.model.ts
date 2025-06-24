export interface PagosDetallePedido {
  PagosDetallePedidosID: number; // Clave Primaria (PK) de la relación
  PagoID: number;                // Clave foránea a Pagos
  PedidoID: number;              // Clave foránea a Pedidos
  MontoCorrespondiente: number;  // Monto del pedido cubierto por este pago
}
