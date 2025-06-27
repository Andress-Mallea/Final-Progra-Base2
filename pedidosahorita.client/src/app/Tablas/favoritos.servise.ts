import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = 'http://localhost:5257/api/ProductosControlador';

  constructor(private http: HttpClient) {}

  agregarFavorito(favorito: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar-favorito`, favorito);
  }
  obtenerFavoritos(usuarioId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/favoritos/${usuarioId}`);
  }
}