// src/app/services/pagos-detalle-pedido.service.ts (Actualizado con más mock data)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PagosDetallePedido } from '../models/pagos-detalle-pedido.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class PagosDetallePedidoService {
  private pagosDetalles: PagosDetallePedido[] = [
    { PagosDetallePedidosID: 1, PagoID: 1, PedidoID: 1, MontoCorrespondiente: 1380.00 },
    { PagosDetallePedidosID: 2, PagoID: 2, PedidoID: 2, MontoCorrespondiente: 270.00 },
    { PagosDetallePedidosID: 3, PagoID: 3, PedidoID: 3, MontoCorrespondiente: 135.00 },
    { PagosDetallePedidosID: 4, PagoID: 4, PedidoID: 4, MontoCorrespondiente: 62.00 },
  ];

  constructor() { }

  getPagosDetallePedido(): Observable<PagosDetallePedido[]> {
    return of(this.pagosDetalles);
  }

  getPagosDetallePedidoById(id: number): Observable<PagosDetallePedido | undefined> {
    const pagoDetalle = this.pagosDetalles.find(p => p.PagosDetallePedidosID === id);
    return of(pagoDetalle);
  }

  getPagosDetallePedidoByPedidoId(pedidoId: number): Observable<PagosDetallePedido | undefined> {
    const pagoDetalle = this.pagosDetalles.find(p => p.PedidoID === pedidoId);
    return of(pagoDetalle);
  }

  addPagosDetallePedido(pagoDetalle: PagosDetallePedido): Observable<PagosDetallePedido> {
    const newId = this.pagosDetalles.length > 0 ? Math.max(...this.pagosDetalles.map(p => p.PagosDetallePedidosID)) + 1 : 1;
    const newPagoDetalle: PagosDetallePedido = { ...pagoDetalle, PagosDetallePedidosID: newId };
    this.pagosDetalles.push(newPagoDetalle);
    return of(newPagoDetalle);
  }

  updatePagosDetallePedido(pagoDetalle: PagosDetallePedido): Observable<PagosDetallePedido | null> {
    const index = this.pagosDetalles.findIndex(p => p.PagosDetallePedidosID === pagoDetalle.PagosDetallePedidosID);
    if (index !== -1) {
      this.pagosDetalles[index] = { ...this.pagosDetalles[index], ...pagoDetalle };
      return of(this.pagosDetalles[index]);
    }
    return of(null);
  }

  deletePagosDetallePedido(id: number): Observable<boolean> {
    const initialLength = this.pagosDetalles.length;
    this.pagosDetalles = this.pagosDetalles.filter(p => p.PagosDetallePedidosID !== id);
    return of(this.pagosDetalles.length < initialLength);
  }
}
