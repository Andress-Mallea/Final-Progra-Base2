// src/app/services/pedido.service.ts (Actualizado con más mock data)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pedido } from '../models/pedido.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos: Pedido[] = [
    { PedidoID: 1, ClienteID: 1, VendedorID: 3, RepartidorID: 5, EstadoDelPedidoID: 4, FechaDePedido: new Date('2024-05-19T10:00:00'), FechaEstimadaDeEntrega: new Date('2024-05-22T18:00:00'), FechaDeEntregaReal: new Date('2024-05-21T16:30:00'), Total: 1380.00, TipoEntrega: 'Envío a domicilio' },
    { PedidoID: 2, ClienteID: 1, VendedorID: 1, RepartidorID: 5, EstadoDelPedidoID: 2, FechaDePedido: new Date('2024-06-01T14:30:00'), FechaEstimadaDeEntrega: new Date('2024-06-05T17:00:00'), FechaDeEntregaReal: new Date('2024-05-21T16:30:00'), Total: 270.00, TipoEntrega: 'Recogida en tienda' },
    { PedidoID: 3, ClienteID: 2, VendedorID: 7, RepartidorID: 5, EstadoDelPedidoID: 3, FechaDePedido: new Date('2024-06-10T09:15:00'), FechaEstimadaDeEntrega: new Date('2024-06-14T12:00:00'), FechaDeEntregaReal: new Date('2024-05-21T16:30:00'), Total: 135.00, TipoEntrega: 'Envío a domicilio' },
    { PedidoID: 4, ClienteID: 1, VendedorID: 8, RepartidorID: 5, EstadoDelPedidoID: 1, FechaDePedido: new Date('2024-06-23T11:00:00'), FechaEstimadaDeEntrega: new Date('2024-06-27T17:00:00'), FechaDeEntregaReal: new Date('2024-05-21T16:30:00'), Total: 62.00, TipoEntrega: 'Envío a domicilio' }
  ];

  constructor() { }

  getPedidos(): Observable<Pedido[]> {
    return of(this.pedidos);
  }

  getPedidoById(id: number): Observable<Pedido | undefined> {
    const pedido = this.pedidos.find(p => p.PedidoID === id);
    return of(pedido);
  }

  addPedido(pedido: Pedido): Observable<Pedido> {
    const newId = this.pedidos.length > 0 ? Math.max(...this.pedidos.map(p => p.PedidoID)) + 1 : 1;
    const newPedido: Pedido = { ...pedido, PedidoID: newId, FechaDePedido: new Date() };
    this.pedidos.push(newPedido);
    return of(newPedido);
  }

  updatePedido(pedido: Pedido): Observable<Pedido | null> {
    const index = this.pedidos.findIndex(p => p.PedidoID === pedido.PedidoID);
    if (index !== -1) {
      this.pedidos[index] = { ...this.pedidos[index], ...pedido };
      return of(this.pedidos[index]);
    }
    return of(null);
  }

  deletePedido(id: number): Observable<boolean> {
    const initialLength = this.pedidos.length;
    this.pedidos = this.pedidos.filter(p => p.PedidoID !== id);
    return of(this.pedidos.length < initialLength);
  }
}
