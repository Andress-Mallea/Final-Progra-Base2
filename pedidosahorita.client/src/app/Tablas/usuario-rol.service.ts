import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UsuarioRol } from '../models/usuario-rol.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de UsuarioRol.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {
  private apiUrl = 'api/usuariorol'; // URL de ejemplo para la API de UsuarioRol

  // Datos simulados para demostración
  private usuariosRoles: UsuarioRol[] = [
    { UsuarioID: 1, RolID: 1 }, // Ana García es Cliente
    { UsuarioID: 2, RolID: 2 }  // Carlos Ruiz es Empleado
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getUsuariosRoles
   * @description Obtiene todas las relaciones UsuarioRol.
   * @returns {Observable<UsuarioRol[]>} Un Observable que emite un array de UsuarioRol.
   */
  getUsuariosRoles(): Observable<UsuarioRol[]> {
    // En un entorno real: return this.http.get<UsuarioRol[]>(this.apiUrl);
    return of(this.usuariosRoles);
  }

  /**
   * @method getUsuarioRolByIds
   * @description Obtiene una relación UsuarioRol por sus IDs de Usuario y Rol.
   * @param {number} usuarioId - El ID del usuario.
   * @param {number} rolId - El ID del rol.
   * @returns {Observable<UsuarioRol | undefined>} Un Observable que emite la relación encontrada o undefined.
   */
  getUsuarioRolByIds(usuarioId: number, rolId: number): Observable<UsuarioRol | undefined> {
    // En un entorno real: return this.http.get<UsuarioRol>(`${this.apiUrl}/${usuarioId}/${rolId}`);
    return of(this.usuariosRoles.find(ur => ur.UsuarioID === usuarioId && ur.RolID === rolId));
  }

  /**
   * @method addUsuarioRol
   * @description Agrega una nueva relación UsuarioRol.
   * @param {UsuarioRol} usuarioRol - La relación UsuarioRol a agregar.
   * @returns {Observable<UsuarioRol>} Un Observable que emite la relación agregada.
   */
  addUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    // En un entorno real: return this.http.post<UsuarioRol>(this.apiUrl, usuarioRol);
    this.usuariosRoles.push(usuarioRol);
    return of(usuarioRol);
  }

  /**
   * @method deleteUsuarioRol
   * @description Elimina una relación UsuarioRol por sus IDs de Usuario y Rol.
   * @param {number} usuarioId - El ID del usuario.
   * @param {number} rolId - El ID del rol.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteUsuarioRol(usuarioId: number, rolId: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${usuarioId}/${rolId}`);
    this.usuariosRoles = this.usuariosRoles.filter(ur => !(ur.UsuarioID === usuarioId && ur.RolID === rolId));
    return of(null);
  }
}