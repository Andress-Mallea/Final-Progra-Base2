export interface Pago {
  PagoID: number;           // Clave Primaria (PK) del pago
  Monto: number;            // Monto del pago
  MetodoDePago?: string;    // Método de pago (ej. "Tarjeta", "QR", "Efectivo")
  NumeroTransaccion?: string; // Número de transacción asociado al pago
  FechaDePago: Date;        // Fecha y hora en que se realizó el pago
  EstadoDePago?: string;    // Estado del pago (ej. "Completado", "Pendiente", "Reembolsado")
  TipoDeTransaccion: string; // Tipo de transacción (ej. 'CLIENTE_PAGO_PEDIDO', 'PLATAFORMA_PAGO_VENDEDOR')
  PedidoID?: number;        // Clave foránea opcional a Pedidos (si es un pago de cliente)
  VendedorID?: number;      // Clave foránea opcional a Vendedores (si es un pago a vendedor)
  PeriodoDesde?: Date;      // Fecha de inicio del período (para pagos a vendedores)
  PeriodoHasta?: Date;      // Fecha de fin del período (para pagos a vendedores)
}