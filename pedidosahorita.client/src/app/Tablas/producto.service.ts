import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto.model'; // Importamos la interfaz de Producto

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Producto.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'api/productos'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración (inicialmente los mismos que en app.component.ts)
  private productos: Producto[] = [
    { id: 1, name: 'Laptop Ultrabook', description: 'Potente y ligera, ideal para trabajo y estudio.', price: 1200.00, StockDisponible: 10, image: 'https://placehold.co/300x200/cccccc/333333?text=Laptop', VendedorID: 201 },
    { id: 2, name: 'Auriculares Inalámbricos', description: 'Sonido de alta fidelidad con cancelación de ruido.', price: 150.00, StockDisponible: 50, image: 'https://placehold.co/300x200/cccccc/333333?text=Auriculares', VendedorID: 201 },
    { id: 3, name: 'Smartphone Pro Max', description: 'Cámara avanzada y rendimiento excepcional.', price: 999.99, StockDisponible: 25, image: 'https://placehold.co/300x200/cccccc/333333?text=Smartphone', VendedorID: 202 },
    { id: 4, name: 'Teclado Mecánico RGB', description: 'Experiencia de escritura y juego superior con retroiluminación.', price: 80.00, StockDisponible: 100, image: 'https://placehold.co/300x200/cccccc/333333?text=Teclado', VendedorID: 203 },
    { id: 5, name: 'Monitor Curvo 27"', description: 'Inmersión total para juegos y productividad.', price: 300.00, StockDisponible: 15, image: 'https://placehold.co/300x200/cccccc/333333?text=Monitor', VendedorID: 201 },
    { id: 6, name: 'Mouse Gamer Ergonómico', description: 'Precisión y comodidad para largas sesiones de juego.', price: 45.00, StockDisponible: 75, image: 'https://placehold.co/300x200/cccccc/333333?text=Mouse', VendedorID: 202 },
    { id: 7, name: 'Webcam Full HD', description: 'Ideal para videollamadas y streaming de calidad.', price: 60.00, StockDisponible: 30, image: 'https://placehold.co/300x200/cccccc/333333?text=Webcam', VendedorID: 203 },
    { id: 8, name: 'Disco Duro SSD 1TB', description: 'Almacenamiento ultrarrápido para todos tus archivos.', price: 110.00, StockDisponible: 40, image: 'https://placehold.co/300x200/cccccc/333333?text=SSD', VendedorID: 201 }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getProductos
   * @description Obtiene todos los productos.
   * @returns {Observable<Producto[]>} Un Observable que emite un array de Producto.
   */
  getProductos(): Observable<Producto[]> {
    // En un entorno real: return this.http.get<Producto[]>(this.apiUrl);
    return of(this.productos);
  }

  /**
   * @method getProductoById
   * @description Obtiene un producto por su ID.
   * @param {number} id - El ID del producto a obtener.
   * @returns {Observable<Producto | undefined>} Un Observable que emite el Producto encontrado o undefined.
   */
  getProductoById(id: number): Observable<Producto | undefined> {
    // En un entorno real: return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    return of(this.productos.find(p => p.id === id));
  }

  /**
   * @method addProducto
   * @description Agrega un nuevo producto.
   * @param {Producto} producto - El producto a agregar.
   * @returns {Observable<Producto>} Un Observable que emite el producto agregado (con su ID asignado).
   */
  addProducto(producto: Producto): Observable<Producto> {
    // En un entorno real: return this.http.post<Producto>(this.apiUrl, producto);
    const newId = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
    const newProducto = { ...producto, id: newId };
    this.productos.push(newProducto);
    return of(newProducto);
  }

  /**
   * @method updateProducto
   * @description Actualiza un producto existente.
   * @param {Producto} producto - El producto a actualizar. Debe contener el ID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateProducto(producto: Producto): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
    const index = this.productos.findIndex(p => p.id === producto.id);
    if (index > -1) {
      this.productos[index] = producto;
      return of(producto);
    }
    return of(null);
  }

  /**
   * @method deleteProducto
   * @description Elimina un producto por su ID.
   * @param {number} id - El ID del producto a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteProducto(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.productos = this.productos.filter(p => p.id !== id);
    return of(null);
  }
}