import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Usuario.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  createUsuario(usuario: Usuario): Observable<Usuario> {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:5257/UsuariosControlador'; // URL de ejemplo para la API de usuarios

  // Datos simulados para demostración
  private usuarios: Usuario[] = [];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getUsuarios
   * @description Obtiene todos los usuarios.
   * @returns {Observable<Usuario[]>} Un Observable que emite un array de Usuario.
   */
  getUsuarios(): Observable<Usuario[]> {
    // En un entorno real: return this.http.get<Usuario[]>(this.apiUrl);
    return of(this.usuarios);
  }

  /**
   * @method getUsuarioById
   * @description Obtiene un usuario por su ID.
   * @param {number} id - El ID del usuario a obtener.
   * @returns {Observable<Usuario | undefined>} Un Observable que emite el Usuario encontrado o undefined.
   */
  getUsuarioById(id: number): Observable<Usuario | undefined> {
    // En un entorno real: return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    return of(this.usuarios.find(u => u.UsuarioID === id));
  }

  /**
   * @method addUsuario
   * @description Agrega un nuevo usuario.
   * @param {Usuario} usuario - El usuario a agregar.
   * @returns {Observable<Usuario>} Un Observable que emite el usuario agregado (con su ID asignado).
   */
  addUsuario(usuario: Usuario): Observable<Usuario> {
    // En un entorno real: return this.http.post<Usuario>(this.apiUrl, usuario);
    const newId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.UsuarioID)) + 1 : 1;
    const newUsuario = { ...usuario, UsuarioID: newId };
    this.usuarios.push(newUsuario);
    return of(newUsuario);
  }

  /**
   * @method updateUsuario
   * @description Actualiza un usuario existente.
   * @param {Usuario} usuario - El usuario a actualizar. Debe contener el UsuarioID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateUsuario(usuario: Usuario): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${usuario.UsuarioID}`, usuario);
    const index = this.usuarios.findIndex(u => u.UsuarioID === usuario.UsuarioID);
    if (index > -1) {
      this.usuarios[index] = usuario;
      return of(usuario);
    }
    return of(null);
  }

  /**
   * @method deleteUsuario
   * @description Elimina un usuario por su ID.
   * @param {number} id - El ID del usuario a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteUsuario(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.usuarios = this.usuarios.filter(u => u.UsuarioID !== id);
    return of(null);
  }
  registerUser(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, user);
  }
}
