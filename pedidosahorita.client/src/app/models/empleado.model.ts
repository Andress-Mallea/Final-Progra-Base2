import { Usuario } from './usuario.model'; // Importa la interfaz base Usuario


export interface Empleado extends Usuario {
  EmpleadoID: number;           // Clave Primaria (PK) y FK a Usuarios
  FechaDeContratacion: Date;    // Fecha de contratación (no nulo en DB)
  FechaDeDespido?: Date;        // Fecha de despido (opcional)
  RolInterno?: string;          // Rol interno del empleado (ej. "Repartidor", "Soporte") (opcional)
  Salario?: number;             // Salario del empleado (opcional)
}