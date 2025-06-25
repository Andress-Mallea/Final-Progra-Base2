import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tienda } from '../models/tienda.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Tienda (Vendedor).
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiUrl = 'http://localhost:5257/api/TiendasControladores'; // URL de ejemplo para la API de tiendas

  // Datos simulados para demostración
  private tiendas: Tienda[] = [ ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getTiendas
   * @description Obtiene todas las tiendas (vendedores).
   * @returns {Observable<Tienda[]>} Un Observable que emite un array de Tienda.
   */
  getTiendas(): Observable<Tienda[]> {
    // En un entorno real: return this.http.get<Tienda[]>(this.apiUrl);
    return of(this.tiendas);
  }

  /**
   * @method getTiendaById
   * @description Obtiene una tienda por su VendedorID.
   * @param {number} id - El VendedorID de la tienda a obtener.
   * @returns {Observable<Tienda | undefined>} Un Observable que emite la Tienda encontrada o undefined.
   */
  getTiendaById(id: number): Observable<Tienda | undefined> {
    // En un entorno real: return this.http.get<Tienda>(`${this.apiUrl}/${id}`);
    return of(this.tiendas.find(t => t.VendedorID === id));
  }

  /**
   * @method addTienda
   * @description Agrega una nueva tienda (vendedor).
   * @param {Tienda} tienda - La tienda a agregar.
   * @returns {Observable<Tienda>} Un Observable que emite la tienda agregada (con su VendedorID asignado).
   */
  addTienda(tienda: Tienda): Observable<Tienda> {
    // En un entorno real: return this.http.post<Tienda>(this.apiUrl, tienda);
    const newId = this.tiendas.length > 0 ? Math.max(...this.tiendas.map(t => t.VendedorID)) + 1 : 1;
    const newTienda = { ...tienda, VendedorID: newId, UsuarioID: newId }; // Simula UsuarioID también
    this.tiendas.push(newTienda);
    return of(newTienda);
  }

  /**
   * @method updateTienda
   * @description Actualiza una tienda existente.
   * @param {Tienda} tienda - La tienda a actualizar. Debe contener el VendedorID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateTienda(tienda: Tienda): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${tienda.VendedorID}`, tienda);
    const index = this.tiendas.findIndex(t => t.VendedorID === tienda.VendedorID);
    if (index > -1) {
      this.tiendas[index] = tienda;
      return of(tienda);
    }
    return of(null);
  }

  /**
   * @method deleteTienda
   * @description Elimina una tienda por su VendedorID.
   * @param {number} id - El VendedorID de la tienda a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteTienda(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.tiendas = this.tiendas.filter(t => t.VendedorID !== id);
    return of(null);
  }
}
