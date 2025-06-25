export interface Producto {
  // Propiedades convertidas a camelCase para coincidir con la respuesta JSON del backend de .NET
  productoID: number;
  vendedorID: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion?: string;
  imagen?: string;
  stockDisponible?: number;
  activo?: boolean;
  fechaCreacion?: Date;
}
