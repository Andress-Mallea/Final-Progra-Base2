export interface Producto {
  id: number;               // Clave Primaria (PK) del producto (usado como ProductoID en el backend)
  name: string;             // Nombre del producto
  description?: string;     // Descripción del producto (opcional)
  price: number;            // Precio del producto
  StockDisponible?: number; // Stock disponible (opcional)
  image?: string;           // URL de la imagen del producto (opcional, mapea a ImagenURL en el backend)
  VendedorID?: number;      // Clave foránea a Vendedores (opcional, si un producto tiene un único vendedor)
  CategoriaID?: number;     // Clave foránea a CategoriasProducto (opcional)
  FechaCreacion?: Date;     // Fecha de creación del producto (opcional)
  Activo?: boolean;         // Estado activo del producto (opcional)
}