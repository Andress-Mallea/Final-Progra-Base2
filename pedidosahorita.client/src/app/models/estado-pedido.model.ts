export interface EstadoPedido {
  EstadoID: number;       // Clave Primaria (PK) del estado
  NombreEstado: string;   // Nombre único del estado (ej. "Pendiente", "Enviado", "Entregado")
}