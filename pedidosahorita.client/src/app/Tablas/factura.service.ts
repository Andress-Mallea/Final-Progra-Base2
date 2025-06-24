import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Factura } from '../models/factura.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Factura.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'api/facturas'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración
  private facturas: Factura[] = [
    {
      FacturaID: 1,
      FechaDeEmision: new Date('2025-06-20T10:00:00Z'),
      MontoTotal: 1280.00,
      TipoDeFactura: 'CLIENTE_COMPRA',
      PedidoID: 1,
      PagoID: 1
    },
    {
      FacturaID: 2,
      FechaDeEmision: new Date('2025-06-21T14:30:00Z'),
      MontoTotal: 300.00,
      TipoDeFactura: 'CLIENTE_COMPRA',
      PedidoID: 3,
      PagoID: 2
    }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getFacturas
   * @description Obtiene todas las facturas.
   * @returns {Observable<Factura[]>} Un Observable que emite un array de Factura.
   */
  getFacturas(): Observable<Factura[]> {
    // En un entorno real: return this.http.get<Factura[]>(this.apiUrl);
    return of(this.facturas);
  }

  /**
   * @method getFacturaById
   * @description Obtiene una factura por su ID.
   * @param {number} id - El ID de la factura a obtener.
   * @returns {Observable<Factura | undefined>} Un Observable que emite la Factura encontrada o undefined.
   */
  getFacturaById(id: number): Observable<Factura | undefined> {
    // En un entorno real: return this.http.get<Factura>(`${this.apiUrl}/${id}`);
    return of(this.facturas.find(f => f.FacturaID === id));
  }

  /**
   * @method addFactura
   * @description Agrega una nueva factura.
   * @param {Factura} factura - La factura a agregar.
   * @returns {Observable<Factura>} Un Observable que emite la factura agregada (con su ID asignado).
   */
  addFactura(factura: Factura): Observable<Factura> {
    // En un entorno real: return this.http.post<Factura>(this.apiUrl, factura);
    const newId = this.facturas.length > 0 ? Math.max(...this.facturas.map(f => f.FacturaID)) + 1 : 1;
    const newFactura = { ...factura, FacturaID: newId };
    this.facturas.push(newFactura);
    return of(newFactura);
  }

  /**
   * @method updateFactura
   * @description Actualiza una factura existente.
   * @param {Factura} factura - La factura a actualizar. Debe contener el FacturaID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateFactura(factura: Factura): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${factura.FacturaID}`, factura);
    const index = this.facturas.findIndex(f => f.FacturaID === factura.FacturaID);
    if (index > -1) {
      this.facturas[index] = factura;
      return of(factura);
    }
    return of(null);
  }

  /**
   * @method deleteFactura
   * @description Elimina una factura por su ID.
   * @param {number} id - El ID de la factura a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteFactura(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.facturas = this.facturas.filter(f => f.FacturaID !== id);
    return of(null);
  }
}