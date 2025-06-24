import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DetalleDePedido } from '../models/detalle-de-pedido.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de DetalleDePedido.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class DetalleDePedidoService {
  private apiUrl = 'api/detallesdepedido'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private detalles: DetalleDePedido[] = [
    { PedidoID: 1, ProductoID: 1, Cantidad: 1, PrecioUnitario: 1200.00 },
    { PedidoID: 1, ProductoID: 4, Cantidad: 1, PrecioUnitario: 80.00 },
    { PedidoID: 2, ProductoID: 2, Cantidad: 2, PrecioUnitario: 150.00 },
    { PedidoID: 3, ProductoID: 5, Cantidad: 1, PrecioUnitario: 300.00 }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getDetallesDePedidos
   * @description Obtiene todos los detalles de pedidos.
   * @returns {Observable<DetalleDePedido[]>} Un Observable que emite un array de DetalleDePedido.
   */
  getDetallesDePedidos(): Observable<DetalleDePedido[]> {
    // En un entorno real: return this.http.get<DetalleDePedido[]>(this.apiUrl);
    return of(this.detalles);
  }

  /**
   * @method getDetallesDePedidoByPedidoId
   * @description Obtiene los detalles de pedidos asociados a un PedidoID específico.
   * @param {number} pedidoId - El ID del pedido.
   * @returns {Observable<DetalleDePedido[]>} Un Observable que emite un array de DetalleDePedido.
   */
  getDetallesDePedidoByPedidoId(pedidoId: number): Observable<DetalleDePedido[]> {
    // En un entorno real: return this.http.get<DetalleDePedido[]>(`${this.apiUrl}/pedido/${pedidoId}`);
    return of(this.detalles.filter(d => d.PedidoID === pedidoId));
  }

  /**
   * @method addDetalleDePedido
   * @description Agrega un nuevo detalle de pedido.
   * @param {DetalleDePedido} detalle - El detalle de pedido a agregar.
   * @returns {Observable<DetalleDePedido>} Un Observable que emite el detalle agregado.
   */
  addDetalleDePedido(detalle: DetalleDePedido): Observable<DetalleDePedido> {
    // En un entorno real: return this.http.post<DetalleDePedido>(this.apiUrl, detalle);
    this.detalles.push(detalle);
    return of(detalle);
  }

  /**
   * @method updateDetalleDePedido
   * @description Actualiza un detalle de pedido existente.
   * @param {DetalleDePedido} detalle - El detalle de pedido a actualizar. Debe contener PedidoID y ProductoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateDetalleDePedido(detalle: DetalleDePedido): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${detalle.PedidoID}/${detalle.ProductoID}`, detalle);
    const index = this.detalles.findIndex(d => d.PedidoID === detalle.PedidoID && d.ProductoID === detalle.ProductoID);
    if (index > -1) {
      this.detalles[index] = detalle;
      return of(detalle);
    }
    return of(null);
  }

  /**
   * @method deleteDetalleDePedido
   * @description Elimina un detalle de pedido por su PedidoID y ProductoID.
   * @param {number} pedidoId - El ID del pedido.
   * @param {number} productoId - El ID del producto.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteDetalleDePedido(pedidoId: number, productoId: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${pedidoId}/${productoId}`);
    this.detalles = this.detalles.filter(d => !(d.PedidoID === pedidoId && d.ProductoID === productoId));
    return of(null);
  }
}