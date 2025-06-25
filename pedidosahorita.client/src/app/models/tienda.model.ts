import { Usuario } from './usuario.model'; // Importa la interfaz base Usuario

export interface Tienda extends Usuario {
  vendedorID: number;           // Clave Primaria (PK) y FK a Usuarios (para el vendedor/dueño de la tienda)
  nombreDeTienda: string;       // Nombre de la tienda (no nulo en DB)
  CuentaDeBanco?: string;       // Información de cuenta bancaria para pagos (opcional)
  Activo: boolean;              // Indica si la tienda está activa (DEFAULT 1 en DB)
}
