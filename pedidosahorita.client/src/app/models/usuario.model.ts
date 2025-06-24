export interface Usuario {
  UsuarioID: number;        // Clave Primaria (PK)
  Nombre: string;           // Nombre del usuario
  Apellido: string;         // Apellido del usuario
  Email: string;            // Correo electrónico (único y no nulo en DB)
  Telefono?: string;        // Número de teléfono (opcional)
  ContrasenaHash: string;   // Hash de la contraseña (nunca se maneja la contraseña en texto plano en el frontend)
  FechaDeRegistro: Date;    // Fecha de registro (DEFAULT GETDATE() en DB)
  Activo: boolean;          // Indica si el usuario está activo (DEFAULT 1 en DB)
}