export interface AuthResponse {
  usuarioID: number;
  nombre: string;
  email: string;
  token: string;
  rol?: string; // Si incluyes el rol en la respuesta del backend
}
