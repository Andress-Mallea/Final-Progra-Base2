export interface Factura {
  FacturaID: number;           // Clave Primaria (PK) de la factura
  FechaDeEmision: Date;        // Fecha y hora de emisión de la factura
  MontoTotal: number;          // Monto total de la factura
  URLFacturaPDF?: string;      // URL opcional al PDF de la factura
  TipoDeFactura: string;       // Tipo de factura (ej. 'CLIENTE_COMPRA', 'VENDEDOR_LIQUIDACION')
  PedidoID?: number;           // Clave foránea opcional a Pedidos (si aplica)
  PagoID?: number;             // Clave foránea opcional a Pagos (si aplica)
}
