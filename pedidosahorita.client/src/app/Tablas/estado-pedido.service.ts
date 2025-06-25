// src/app/services/estado-pedido.service.ts (Actualizado con más estados si fuera necesario)

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EstadoPedido } from '../models/estado-pedido.model'; // Usa la interfaz PascalCase

@Injectable({
  providedIn: 'root'
})
export class EstadoPedidoService {
  private estados: EstadoPedido[] = [
    { EstadoID: 1, NombreEstado: 'Pendiente' },
    { EstadoID: 2, NombreEstado: 'Procesando' },
    { EstadoID: 3, NombreEstado: 'Enviado' },
    { EstadoID: 4, NombreEstado: 'Entregado' },
    { EstadoID: 5, NombreEstado: 'Cancelado' },
    { EstadoID: 6, NombreEstado: 'Reembolsado' } // Nuevo estado para ejemplo
  ];

  constructor() { }

  getEstados(): Observable<EstadoPedido[]> {
    return of(this.estados);
  }

  getEstadoById(id: number): Observable<EstadoPedido | undefined> {
    const estado = this.estados.find(e => e.EstadoID === id);
    return of(estado);
  }

  addEstado(estado: EstadoPedido): Observable<EstadoPedido> {
    const newId = this.estados.length > 0 ? Math.max(...this.estados.map(e => e.EstadoID)) + 1 : 1;
    const newEstado: EstadoPedido = { ...estado, EstadoID: newId };
    this.estados.push(newEstado);
    return of(newEstado);
  }

  updateEstado(estado: EstadoPedido): Observable<EstadoPedido | null> {
    const index = this.estados.findIndex(e => e.EstadoID === estado.EstadoID);
    if (index !== -1) {
      this.estados[index] = { ...this.estados[index], ...estado };
      return of(this.estados[index]);
    }
    return of(null);
  }

  deleteEstado(id: number): Observable<boolean> {
    const initialLength = this.estados.length;
    this.estados = this.estados.filter(e => e.EstadoID !== id);
    return of(this.estados.length < initialLength);
  }
}
