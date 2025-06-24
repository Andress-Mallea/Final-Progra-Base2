import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Pago } from '../models/pago.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Pago.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'api/pagos'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private pagos: Pago[] = [
    {
      PagoID: 1,
      Monto: 1280.00,
      MetodoDePago: 'Tarjeta',
      NumeroTransaccion: 'TRANS001',
      FechaDePago: new Date('2025-06-20T09:55:00Z'),
      EstadoDePago: 'Completado',
      TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO',
      PedidoID: 1
    },
    {
      PagoID: 2,
      Monto: 300.00,
      MetodoDePago: 'QR',
      NumeroTransaccion: 'QR002',
      FechaDePago: new Date('2025-06-21T14:25:00Z'),
      EstadoDePago: 'Completado',
      TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO',
      PedidoID: 3
    },
    {
      PagoID: 3,
      Monto: 500.00,
      MetodoDePago: 'Transferencia',
      NumeroTransaccion: 'VENDPAGO001',
      FechaDePago: new Date('2025-06-15T12:00:00Z'),
      EstadoDePago: 'Completado',
      TipoDeTransaccion: 'PLATAFORMA_PAGO_VENDEDOR',
      VendedorID: 1,
      PeriodoDesde: new Date('2025-06-01'),
      PeriodoHasta: new Date('2025-06-14')
    }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getPagos
   * @description Obtiene todos los pagos.
   * @returns {Observable<Pago[]>} Un Observable que emite un array de Pago.
   */
  getPagos(): Observable<Pago[]> {
    // En un entorno real: return this.http.get<Pago[]>(this.apiUrl);
    return of(this.pagos);
  }

  /**
   * @method getPagoById
   * @description Obtiene un pago por su ID.
   * @param {number} id - El ID del pago a obtener.
   * @returns {Observable<Pago | undefined>} Un Observable que emite el Pago encontrado o undefined.
   */
  getPagoById(id: number): Observable<Pago | undefined> {
    // En un entorno real: return this.http.get<Pago>(`${this.apiUrl}/${id}`);
    return of(this.pagos.find(p => p.PagoID === id));
  }

  /**
   * @method addPago
   * @description Agrega un nuevo pago.
   * @param {Pago} pago - El pago a agregar.
   * @returns {Observable<Pago>} Un Observable que emite el pago agregado (con su ID asignado).
   */
  addPago(pago: Pago): Observable<Pago> {
    // En un entorno real: return this.http.post<Pago>(this.apiUrl, pago);
    const newId = this.pagos.length > 0 ? Math.max(...this.pagos.map(p => p.PagoID)) + 1 : 1;
    const newPago = { ...pago, PagoID: newId };
    this.pagos.push(newPago);
    return of(newPago);
  }

  /**
   * @method updatePago
   * @description Actualiza un pago existente.
   * @param {Pago} pago - El pago a actualizar. Debe contener el PagoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updatePago(pago: Pago): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${pago.PagoID}`, pago);
    const index = this.pagos.findIndex(p => p.PagoID === pago.PagoID);
    if (index > -1) {
      this.pagos[index] = pago;
      return of(pago);
    }
    return of(null);
  }

  /**
   * @method deletePago
   * @description Elimina un pago por su ID.
   * @param {number} id - El ID del pago a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deletePago(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.pagos = this.pagos.filter(p => p.PagoID !== id);
    return of(null);
  }
}