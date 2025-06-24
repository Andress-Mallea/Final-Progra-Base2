import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RolDeUsuario } from '../models/rol-de-usuario.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de RolDeUsuario.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class RolDeUsuarioService {
  private apiUrl = 'api/rolesdeusuario'; // URL de ejemplo para la API de roles de usuario

  // Datos simulados para demostración
  private roles: RolDeUsuario[] = [
    { RolID: 1, NombreRol: 'Cliente' },
    { RolID: 2, NombreRol: 'Empleado' },
    { RolID: 3, NombreRol: 'Vendedor' },
    { RolID: 4, NombreRol: 'Administrador' },
    { RolID: 5, NombreRol: 'Repartidor' }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getRolesDeUsuario
   * @description Obtiene todos los roles de usuario.
   * @returns {Observable<RolDeUsuario[]>} Un Observable que emite un array de RolDeUsuario.
   */
  getRolesDeUsuario(): Observable<RolDeUsuario[]> {
    // En un entorno real: return this.http.get<RolDeUsuario[]>(this.apiUrl);
    return of(this.roles);
  }

  /**
   * @method getRolDeUsuarioById
   * @description Obtiene un rol de usuario por su ID.
   * @param {number} id - El ID del rol a obtener.
   * @returns {Observable<RolDeUsuario | undefined>} Un Observable que emite el RolDeUsuario encontrado o undefined.
   */
  getRolDeUsuarioById(id: number): Observable<RolDeUsuario | undefined> {
    // En un entorno real: return this.http.get<RolDeUsuario>(`${this.apiUrl}/${id}`);
    return of(this.roles.find(r => r.RolID === id));
  }

  /**
   * @method addRolDeUsuario
   * @description Agrega un nuevo rol de usuario.
   * @param {RolDeUsuario} rol - El rol de usuario a agregar.
   * @returns {Observable<RolDeUsuario>} Un Observable que emite el rol agregado (con su ID asignado).
   */
  addRolDeUsuario(rol: RolDeUsuario): Observable<RolDeUsuario> {
    // En un entorno real: return this.http.post<RolDeUsuario>(this.apiUrl, rol);
    const newId = this.roles.length > 0 ? Math.max(...this.roles.map(r => r.RolID)) + 1 : 1;
    const newRol = { ...rol, RolID: newId };
    this.roles.push(newRol);
    return of(newRol);
  }

  /**
   * @method updateRolDeUsuario
   * @description Actualiza un rol de usuario existente.
   * @param {RolDeUsuario} rol - El rol de usuario a actualizar. Debe contener el RolID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateRolDeUsuario(rol: RolDeUsuario): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${rol.RolID}`, rol);
    const index = this.roles.findIndex(r => r.RolID === rol.RolID);
    if (index > -1) {
      this.roles[index] = rol;
      return of(rol);
    }
    return of(null);
  }

  /**
   * @method deleteRolDeUsuario
   * @description Elimina un rol de usuario por su ID.
   * @param {number} id - El ID del rol a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteRolDeUsuario(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.roles = this.roles.filter(r => r.RolID !== id);
    return of(null);
  }
}