import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PagosDetallePedido } from '../models/pagos-detalle-pedido.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de PagosDetallePedido.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PagosDetallePedidoService {
  private apiUrl = 'api/pagosdetallepedido'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private pagosDetalles: PagosDetallePedido[] = [
    { PagosDetallePedidosID: 1, PagoID: 1, PedidoID: 1, MontoCorrespondiente: 1280.00 },
    { PagosDetallePedidosID: 2, PagoID: 2, PedidoID: 3, MontoCorrespondiente: 300.00 }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getPagosDetallePedido
   * @description Obtiene todas las relaciones PagosDetallePedido.
   * @returns {Observable<PagosDetallePedido[]>} Un Observable que emite un array de PagosDetallePedido.
   */
  getPagosDetallePedido(): Observable<PagosDetallePedido[]> {
    // En un entorno real: return this.http.get<PagosDetallePedido[]>(this.apiUrl);
    return of(this.pagosDetalles);
  }

  /**
   * @method getPagosDetallePedidoById
   * @description Obtiene una relación PagosDetallePedido por su ID.
   * @param {number} id - El ID de la relación a obtener.
   * @returns {Observable<PagosDetallePedido | undefined>} Un Observable que emite la relación encontrada o undefined.
   */
  getPagosDetallePedidoById(id: number): Observable<PagosDetallePedido | undefined> {
    // En un entorno real: return this.http.get<PagosDetallePedido>(`${this.apiUrl}/${id}`);
    return of(this.pagosDetalles.find(p => p.PagosDetallePedidosID === id));
  }

  /**
   * @method addPagosDetallePedido
   * @description Agrega una nueva relación PagosDetallePedido.
   * @param {PagosDetallePedido} relacion - La relación a agregar.
   * @returns {Observable<PagosDetallePedido>} Un Observable que emite la relación agregada (con su ID asignado).
   */
  addPagosDetallePedido(relacion: PagosDetallePedido): Observable<PagosDetallePedido> {
    // En un entorno real: return this.http.post<PagosDetallePedido>(this.apiUrl, relacion);
    const newId = this.pagosDetalles.length > 0 ? Math.max(...this.pagosDetalles.map(p => p.PagosDetallePedidosID)) + 1 : 1;
    const newRelacion = { ...relacion, PagosDetallePedidosID: newId };
    this.pagosDetalles.push(newRelacion);
    return of(newRelacion);
  }

  /**
   * @method updatePagosDetallePedido
   * @description Actualiza una relación PagosDetallePedido existente.
   * @param {PagosDetallePedido} relacion - La relación a actualizar. Debe contener el PagosDetallePedidosID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updatePagosDetallePedido(relacion: PagosDetallePedido): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${relacion.PagosDetallePedidosID}`, relacion);
    const index = this.pagosDetalles.findIndex(p => p.PagosDetallePedidosID === relacion.PagosDetallePedidosID);
    if (index > -1) {
      this.pagosDetalles[index] = relacion;
      return of(relacion);
    }
    return of(null);
  }

  /**
   * @method deletePagosDetallePedido
   * @description Elimina una relación PagosDetallePedido por su ID.
   * @param {number} id - El ID de la relación a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deletePagosDetallePedido(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.pagosDetalles = this.pagosDetalles.filter(p => p.PagosDetallePedidosID !== id);
    return of(null);
  }
}
