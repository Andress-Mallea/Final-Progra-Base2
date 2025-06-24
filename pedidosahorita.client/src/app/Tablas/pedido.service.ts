import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Pedido } from '../models/pedido.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Pedido.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'api/pedidos'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private pedidos: Pedido[] = [
    {
      PedidoID: 1,
      ClienteID: 1,
      VendedorID: 201,
      EstadoDelPedidoID: 3,
      FechaDePedido: new Date('2025-06-20T09:00:00Z'),
      FechaEstimadaDeEntrega: new Date('2025-06-22T18:00:00Z'),
      Total: 1280.00,
      TipoEntrega: 'A domicilio'
    },
    {
      PedidoID: 2,
      ClienteID: 2,
      VendedorID: 202,
      EstadoDelPedidoID: 4,
      FechaDePedido: new Date('2025-06-18T15:00:00Z'),
      FechaDeEntregaReal: new Date('2025-06-19T10:00:00Z'),
      Total: 150.00,
      TipoEntrega: 'Recogida en tienda'
    },
    {
      PedidoID: 3,
      ClienteID: 1,
      VendedorID: 203,
      EstadoDelPedidoID: 1,
      FechaDePedido: new Date('2025-06-23T11:00:00Z'),
      Total: 300.00,
      TipoEntrega: 'A domicilio'
    }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getPedidos
   * @description Obtiene todos los pedidos.
   * @returns {Observable<Pedido[]>} Un Observable que emite un array de Pedido.
   */
  getPedidos(): Observable<Pedido[]> {
    // En un entorno real: return this.http.get<Pedido[]>(this.apiUrl);
    return of(this.pedidos);
  }

  /**
   * @method getPedidoById
   * @description Obtiene un pedido por su ID.
   * @param {number} id - El ID del pedido a obtener.
   * @returns {Observable<Pedido | undefined>} Un Observable que emite el Pedido encontrado o undefined.
   */
  getPedidoById(id: number): Observable<Pedido | undefined> {
    // En un entorno real: return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
    return of(this.pedidos.find(p => p.PedidoID === id));
  }

  /**
   * @method addPedido
   * @description Agrega un nuevo pedido.
   * @param {Pedido} pedido - El pedido a agregar.
   * @returns {Observable<Pedido>} Un Observable que emite el pedido agregado (con su ID asignado).
   */
  addPedido(pedido: Pedido): Observable<Pedido> {
    // En un entorno real: return this.http.post<Pedido>(this.apiUrl, pedido);
    const newId = this.pedidos.length > 0 ? Math.max(...this.pedidos.map(p => p.PedidoID)) + 1 : 1;
    const newPedido = { ...pedido, PedidoID: newId };
    this.pedidos.push(newPedido);
    return of(newPedido);
  }

  /**
   * @method updatePedido
   * @description Actualiza un pedido existente.
   * @param {Pedido} pedido - El pedido a actualizar. Debe contener el PedidoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updatePedido(pedido: Pedido): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${pedido.PedidoID}`, pedido);
    const index = this.pedidos.findIndex(p => p.PedidoID === pedido.PedidoID);
    if (index > -1) {
      this.pedidos[index] = pedido;
      return of(pedido);
    }
    return of(null);
  }

  /**
   * @method deletePedido
   * @description Elimina un pedido por su ID.
   * @param {number} id - El ID del pedido a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deletePedido(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.pedidos = this.pedidos.filter(p => p.PedidoID !== id);
    return of(null);
  }
}
