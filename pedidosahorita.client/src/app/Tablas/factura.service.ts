// src/app/services/factura.service.ts (Actualizado con más mock data)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Factura } from '../models/factura.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private facturas: Factura[] = [
    { FacturaID: 1, FechaDeEmision: new Date('2024-05-20T10:10:00'), MontoTotal: 1380.00, TipoDeFactura: 'CLIENTE_COMPRA', PedidoID: 1, PagoID: 1, URLFacturaPDF: 'https://example.com/factura/1.pdf' },
    { FacturaID: 2, FechaDeEmision: new Date('2024-06-01T14:40:00'), MontoTotal: 270.00, TipoDeFactura: 'CLIENTE_COMPRA', PedidoID: 2, PagoID: 2, URLFacturaPDF: 'https://example.com/factura/2.pdf' },
    { FacturaID: 3, FechaDeEmision: new Date('2024-06-10T09:25:00'), MontoTotal: 135.00, TipoDeFactura: 'CLIENTE_COMPRA', PedidoID: 3, PagoID: 3, URLFacturaPDF: '' }, // Sin PDF
    { FacturaID: 4, FechaDeEmision: new Date('2024-06-23T11:10:00'), MontoTotal: 62.00, TipoDeFactura: 'CLIENTE_COMPRA', PedidoID: 4, PagoID: 4, URLFacturaPDF: 'https://example.com/factura/4.pdf' }
  ];

  constructor() { }

  getFacturas(): Observable<Factura[]> {
    return of(this.facturas);
  }

  getFacturaById(id: number): Observable<Factura | undefined> {
    const factura = this.facturas.find(f => f.FacturaID === id);
    return of(factura);
  }

  getFacturaByPedidoId(pedidoId: number): Observable<Factura | undefined> {
    const factura = this.facturas.find(f => f.PedidoID === pedidoId);
    return of(factura);
  }

  addFactura(factura: Factura): Observable<Factura> {
    const newId = this.facturas.length > 0 ? Math.max(...this.facturas.map(f => f.FacturaID)) + 1 : 1;
    const newFactura: Factura = { ...factura, FacturaID: newId, FechaDeEmision: new Date() };
    this.facturas.push(newFactura);
    return of(newFactura);
  }

  updateFactura(factura: Factura): Observable<Factura | null> {
    const index = this.facturas.findIndex(f => f.FacturaID === factura.FacturaID);
    if (index !== -1) {
      this.facturas[index] = { ...this.facturas[index], ...factura };
      return of(this.facturas[index]);
    }
    return of(null);
  }

  deleteFactura(id: number): Observable<boolean> {
    const initialLength = this.facturas.length;
    this.facturas = this.facturas.filter(f => f.FacturaID !== id);
    return of(this.facturas.length < initialLength);
  }
}
