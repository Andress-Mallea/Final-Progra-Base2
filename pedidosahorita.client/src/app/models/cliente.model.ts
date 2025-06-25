import { Usuario } from './usuario.model'; // Importa la interfaz base Usuario


export interface Cliente  {
  ClienteID: number;        // Clave Primaria (PK) y FK a Usuarios
  Direccion?: string;       // Dirección del cliente (opcional)
  Ciudad?: string;          // Ciudad del cliente (opcional)
  CodigoPostal?: string;    // Código postal del cliente (opcional)
}
