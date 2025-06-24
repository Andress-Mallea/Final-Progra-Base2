import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EstadoPedido } from '../models/estado-pedido.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de EstadoPedido.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class EstadoPedidoService {
  private apiUrl = 'api/estadospedido'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private estados: EstadoPedido[] = [
    { EstadoID: 1, NombreEstado: 'Pendiente' },
    { EstadoID: 2, NombreEstado: 'En Proceso' },
    { EstadoID: 3, NombreEstado: 'Enviado' },
    { EstadoID: 4, NombreEstado: 'Entregado' },
    { EstadoID: 5, NombreEstado: 'Cancelado' }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getEstadosPedido
   * @description Obtiene todos los estados de pedido.
   * @returns {Observable<EstadoPedido[]>} Un Observable que emite un array de EstadoPedido.
   */
  getEstadosPedido(): Observable<EstadoPedido[]> {
    // En un entorno real: return this.http.get<EstadoPedido[]>(this.apiUrl);
    return of(this.estados);
  }

  /**
   * @method getEstadoPedidoById
   * @description Obtiene un estado de pedido por su ID.
   * @param {number} id - El ID del estado a obtener.
   * @returns {Observable<EstadoPedido | undefined>} Un Observable que emite el EstadoPedido encontrado o undefined.
   */
  getEstadoPedidoById(id: number): Observable<EstadoPedido | undefined> {
    // En un entorno real: return this.http.get<EstadoPedido>(`${this.apiUrl}/${id}`);
    return of(this.estados.find(e => e.EstadoID === id));
  }

  /**
   * @method addEstadoPedido
   * @description Agrega un nuevo estado de pedido.
   * @param {EstadoPedido} estado - El estado de pedido a agregar.
   * @returns {Observable<EstadoPedido>} Un Observable que emite el estado agregado (con su ID asignado).
   */
  addEstadoPedido(estado: EstadoPedido): Observable<EstadoPedido> {
    // En un entorno real: return this.http.post<EstadoPedido>(this.apiUrl, estado);
    const newId = this.estados.length > 0 ? Math.max(...this.estados.map(e => e.EstadoID)) + 1 : 1;
    const newEstado = { ...estado, EstadoID: newId };
    this.estados.push(newEstado);
    return of(newEstado);
  }

  /**
   * @method updateEstadoPedido
   * @description Actualiza un estado de pedido existente.
   * @param {EstadoPedido} estado - El estado de pedido a actualizar. Debe contener el EstadoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateEstadoPedido(estado: EstadoPedido): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${estado.EstadoID}`, estado);
    const index = this.estados.findIndex(e => e.EstadoID === estado.EstadoID);
    if (index > -1) {
      this.estados[index] = estado;
      return of(estado);
    }
    return of(null);
  }

  /**
   * @method deleteEstadoPedido
   * @description Elimina un estado de pedido por su ID.
   * @param {number} id - El ID del estado a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteEstadoPedido(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.estados = this.estados.filter(e => e.EstadoID !== id);
    return of(null);
  }
}