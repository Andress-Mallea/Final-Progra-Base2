// src/app/services/pago.service.ts (Actualizado con más mock data)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pago } from '../models/pago.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private pagos: Pago[] = [
    { PagoID: 1, Monto: 1380.00, MetodoDePago: 'Tarjeta', NumeroTransaccion: 'TRANS123', FechaDePago: new Date('2024-05-20T10:05:00'), EstadoDePago: 'Completado', TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO', PedidoID: 1, VendedorID: 6, PeriodoDesde: new Date('2024-05-20T10:05:00'), PeriodoHasta: new Date('2024-05-21T10:05:00') },
    { PagoID: 2, Monto: 270.00, MetodoDePago: 'QR', NumeroTransaccion: 'QRTRANS456', FechaDePago: new Date('2024-06-01T14:35:00'), EstadoDePago: 'Completado', TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO', PedidoID: 2, VendedorID: 6, PeriodoDesde: new Date('2024-05-20T10:05:00'), PeriodoHasta: new Date('2024-05-21T10:05:00') },
    { PagoID: 3, Monto: 135.00, MetodoDePago: 'Tarjeta', NumeroTransaccion: 'TRANS789', FechaDePago: new Date('2024-06-10T09:20:00'), EstadoDePago: 'Completado', TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO', PedidoID: 3, VendedorID: 6, PeriodoDesde: new Date('2024-05-20T10:05:00'), PeriodoHasta: new Date('2024-05-21T10:05:00') },
    { PagoID: 4, Monto: 62.00, MetodoDePago: 'Efectivo', NumeroTransaccion: 'EFE001', FechaDePago: new Date('2024-06-23T11:05:00'), EstadoDePago: 'Pendiente', TipoDeTransaccion: 'CLIENTE_PAGO_PEDIDO', PedidoID: 4, VendedorID: 6, PeriodoDesde: new Date('2024-05-20T10:05:00'), PeriodoHasta: new Date('2024-05-21T10:05:00') }
  ];

  constructor() { }

  getPagos(): Observable<Pago[]> {
    return of(this.pagos);
  }

  getPagoById(id: number): Observable<Pago | undefined> {
    const pago = this.pagos.find(p => p.PagoID === id);
    return of(pago);
  }

  getPagosByPedidoId(pedidoId: number): Observable<Pago | undefined> {
    const pago = this.pagos.find(p => p.PedidoID === pedidoId);
    return of(pago);
  }

  addPago(pago: Pago): Observable<Pago> {
    const newId = this.pagos.length > 0 ? Math.max(...this.pagos.map(p => p.PagoID)) + 1 : 1;
    const newPago: Pago = { ...pago, PagoID: newId, FechaDePago: new Date() };
    this.pagos.push(newPago);
    return of(newPago);
  }

  updatePago(pago: Pago): Observable<Pago | null> {
    const index = this.pagos.findIndex(p => p.PagoID === pago.PagoID);
    if (index !== -1) {
      this.pagos[index] = { ...this.pagos[index], ...pago };
      return of(this.pagos[index]);
    }
    return of(null);
  }

  deletePago(id: number): Observable<boolean> {
    const initialLength = this.pagos.length;
    this.pagos = this.pagos.filter(p => p.PagoID !== id);
    return of(this.pagos.length < initialLength);
  }
}
