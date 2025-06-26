import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Producto } from '../models/producto.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Producto.
 * Interactúa con el backend de .NET, combinando datos de SQL y MongoDB.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // La URL debe ser 'http://localhost:5257/api/Productos'
  // El '[controller]' en .NET se traduce al nombre del controlador sin la palabra 'Controlador'.
  private apiUrl = 'http://localhost:5257/api/ProductosControlador'; // <--- URL CORREGIDA y puerto 5257

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getProductos
   * @description Obtiene todos los productos del backend, enriquecidos con datos de MongoDB.
   * @returns {Observable<Producto[]>} Un Observable que emite un array de Producto.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /**
   * @method getProductoById
   * @description Obtiene un producto por su ID del backend, enriquecido con datos de MongoDB.
   * @param {number} id - El ID del producto a obtener.
   * @returns {Observable<Producto>} Un Observable que emite el Producto encontrado.
   */
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method addProducto
   * @description Agrega un nuevo producto al backend (SQL y MongoDB).
   * @param {Producto} producto - El producto a agregar.
   * @returns {Observable<Producto>} Un Observable que emite el producto agregado.
   */
  getProductsByVendedorId(vendedorId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/ByVendedor/${vendedorId}`);
  }
  addProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /**
   * @method updateProducto
   * @description Actualiza un producto existente en el backend (SQL y MongoDB).
   * @param {Producto} producto - El producto a actualizar. Debe contener el ProductoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateProducto(producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${producto.productoID}`, producto);
  }

  /**
   * @method deleteProducto
   * @description Elimina un producto por su ID del backend (SQL y MongoDB).
   * @param {number} id - El ID del producto a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
