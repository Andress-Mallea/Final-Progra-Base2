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
    { id: 1, name: 'Laptop Gaming', description: 'Potente laptop para juegos de última generación.', price: 1200.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Laptop', VendedorID: 1, StockDisponible: 10, Activo: true, FechaCreacion: new Date('2024-01-15') },
    { id: 2, name: 'Teclado Mecánico', description: 'Teclado con switches Cherry MX y retroiluminación RGB.', price: 90.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Teclado', VendedorID: 1, StockDisponible: 50, Activo: true, FechaCreacion: new Date('2024-02-01') },
    { id: 3, name: 'Mouse Inalámbrico', description: 'Mouse ergonómico con alta precisión para gaming.', price: 50.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Mouse', VendedorID: 2, StockDisponible: 75, Activo: true, FechaCreacion: new Date('2024-02-10') },
    { id: 4, name: 'Monitor Curvo 27"', description: 'Monitor 144Hz para una experiencia inmersiva.', price: 300.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Monitor', VendedorID: 2, StockDisponible: 20, Activo: true, FechaCreacion: new Date('2024-03-01') },
    { id: 5, name: 'Auriculares Gaming', description: 'Sonido envolvente 7.1 y micrófono retráctil.', price: 75.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Auriculares', VendedorID: 3, StockDisponible: 40, Activo: true, FechaCreacion: new Date('2024-03-05') },
    { id: 6, name: 'Webcam HD', description: 'Webcam Full HD 1080p con enfoque automático.', price: 45.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Webcam', VendedorID: 3, StockDisponible: 60, Activo: true, FechaCreacion: new Date('2024-03-10') },
    { id: 7, name: 'Silla Gamer', description: 'Silla ergonómica con soporte lumbar y reposacabezas ajustable.', price: 250.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Silla', VendedorID: 1, StockDisponible: 15, Activo: true, FechaCreacion: new Date('2024-04-01') },
    { id: 8, name: 'Impresora Multifunción', description: 'Impresora de inyección de tinta con escáner y copiadora.', price: 150.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Impresora', VendedorID: 2, StockDisponible: 25, Activo: true, FechaCreacion: new Date('2024-04-10') },
    { id: 9, name: 'SSD 1TB', description: 'Unidad de estado sólido de alta velocidad para almacenamiento.', price: 100.00, image: 'https://placehold.co/300x200/cccccc/333333?text=SSD', VendedorID: 3, StockDisponible: 30, Activo: true, FechaCreacion: new Date('2024-05-01') },
    { id: 10, name: 'Router Wi-Fi 6', description: 'Router de última generación para conexiones ultrarrápidas.', price: 120.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Router', VendedorID: 1, StockDisponible: 18, Activo: true, FechaCreacion: new Date('2024-05-05') },
    // Nuevos productos para las nuevas tiendas
    { id: 11, name: 'Termo de Acero Inoxidable', description: 'Mantiene tus bebidas frías o calientes por horas.', price: 25.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Termo', VendedorID: 4, StockDisponible: 100, Activo: true, FechaCreacion: new Date('2024-06-10') },
    { id: 12, name: 'Set de Utensilios de Bambú', description: 'Amigable con el medio ambiente y duradero.', price: 35.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Utensilios', VendedorID: 4, StockDisponible: 70, Activo: true, FechaCreacion: new Date('2024-06-12') },
    { id: 13, name: 'Novela de Ficción Histórica', description: 'Un viaje cautivador a través del tiempo.', price: 20.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Novela', VendedorID: 6, StockDisponible: 120, Activo: true, FechaCreacion: new Date('2024-07-20') },
    { id: 14, name: 'Libro de Cocina Vegana', description: 'Recetas deliciosas y saludables para todos.', price: 18.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Cocina', VendedorID: 6, StockDisponible: 90, Activo: true, FechaCreacion: new Date('2024-07-22') },
    { id: 15, name: 'Vestido de Verano Floral', description: 'Ligero y fresco para los días soleados.', price: 55.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Vestido', VendedorID: 7, StockDisponible: 60, Activo: true, FechaCreacion: new Date('2024-08-20') },
    { id: 16, name: 'Zapatillas Deportivas', description: 'Comodidad y estilo para tu rutina de ejercicios.', price: 80.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Zapatillas', VendedorID: 7, StockDisponible: 45, Activo: true, FechaCreacion: new Date('2024-08-25') },
    { id: 17, name: 'Set de Construcción de Bloques', description: 'Horas de diversión creativa para niños.', price: 40.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Bloques', VendedorID: 8, StockDisponible: 110, Activo: true, FechaCreacion: new Date('2024-09-05') },
    { id: 18, name: 'Peluche Suave de Animal', description: 'El compañero perfecto para abrazar.', price: 22.00, image: 'https://placehold.co/300x200/cccccc/333333?text=Peluche', VendedorID: 8, StockDisponible: 150, Activo: true, FechaCreacion: new Date('2024-09-10') },
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