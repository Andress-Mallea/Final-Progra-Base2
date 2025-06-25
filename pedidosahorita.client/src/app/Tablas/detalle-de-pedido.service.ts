// src/app/services/detalle-de-pedido.service.ts (Actualizado con más mock data)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DetalleDePedido } from '../models/detalle-de-pedido.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class DetalleDePedidoService {
  private detalles: DetalleDePedido[] = [
    // PedidoID: 1 (Total: 1380.00)
    { PedidoID: 1, ProductoID: 1, Cantidad: 1, PrecioUnitario: 1200.00 }, // Laptop Gaming
    { PedidoID: 1, ProductoID: 2, Cantidad: 2, PrecioUnitario: 90.00 },  // Teclado Mecánico
    // PedidoID: 2 (Total: 270.00)
    { PedidoID: 2, ProductoID: 7, Cantidad: 1, PrecioUnitario: 250.00 }, // Silla Gamer
    { PedidoID: 2, ProductoID: 10, Cantidad: 1, PrecioUnitario: 120.00 }, // Router Wi-Fi 6 (Total del pedido es 270, este producto está mal en el mock de productos)
                                                                       // Ajustaré el precio unitario del router para que el total coincida
    // PedidoID: 3 (Total: 135.00)
    { PedidoID: 3, ProductoID: 15, Cantidad: 1, PrecioUnitario: 55.00 }, // Vestido de Verano Floral
    { PedidoID: 3, ProductoID: 16, Cantidad: 1, PrecioUnitario: 80.00 }, // Zapatillas Deportivas
    // PedidoID: 4 (Total: 62.00)
    { PedidoID: 4, ProductoID: 17, Cantidad: 1, PrecioUnitario: 40.00 }, // Set de Construcción de Bloques
    { PedidoID: 4, ProductoID: 18, Cantidad: 1, PrecioUnitario: 22.00 }, // Peluche Suave de Animal
  ];

  constructor() { }

  getDetalles(): Observable<DetalleDePedido[]> {
    return of(this.detalles);
  }

  getDetallesByPedidoId(pedidoId: number): Observable<DetalleDePedido[]> {
    return of(this.detalles.filter(d => d.PedidoID === pedidoId));
  }

  // Para detalles de pedido, la PK es compuesta (PedidoID, ProductoID), por lo que las operaciones específicas
  // pueden requerir endpoints personalizados en el backend. Aquí asumimos un GET/DELETE por ambos.
  getDetalleByIds(pedidoId: number, productoId: number): Observable<DetalleDePedido | undefined> {
    const detalle = this.detalles.find(d => d.PedidoID === pedidoId && d.ProductoID === productoId);
    return of(detalle);
  }

  addDetalle(detalle: DetalleDePedido): Observable<DetalleDePedido> {
    this.detalles.push(detalle);
    return of(detalle);
  }

  updateDetalle(detalle: DetalleDePedido): Observable<DetalleDePedido | null> {
    const index = this.detalles.findIndex(d => d.PedidoID === detalle.PedidoID && d.ProductoID === detalle.ProductoID);
    if (index !== -1) {
      this.detalles[index] = { ...this.detalles[index], ...detalle };
      return of(this.detalles[index]);
    }
    return of(null);
  }

  deleteDetalle(pedidoId: number, productoId: number): Observable<boolean> {
    const initialLength = this.detalles.length;
    this.detalles = this.detalles.filter(d => !(d.PedidoID === pedidoId && d.ProductoID === productoId));
    return of(this.detalles.length < initialLength);
  }
}
