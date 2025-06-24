import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Importamos 'of' para simular respuestas del servidor
import { CategoriaProducto } from '../models/categoria-producto.model'; // Importamos la interfaz de la categoría

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de CategoriaProducto.
 * Simula interacciones con un backend a través de HttpClient.
 */
@Injectable({
  providedIn: 'root' // Este servicio estará disponible en toda la aplicación
})
export class CategoriaProductoService {
  // URL base de la API para las categorías de productos.
  // En un entorno real, esta URL sería el endpoint de tu backend.
  private apiUrl = 'api/categoriasproducto'; // URL de ejemplo, reemplazar con la URL real de tu API

  // Datos simulados para demostración. En una aplicación real, esto provendría del backend.
  private categorias: CategoriaProducto[] = [
    { CategoriaID: 1, NombreCategoria: 'Electrónica' },
    { CategoriaID: 2, NombreCategoria: 'Ropa' },
    { CategoriaID: 3, NombreCategoria: 'Alimentos' },
    { CategoriaID: 4, NombreCategoria: 'Hogar' }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient para realizar peticiones HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getCategorias
   * @description Obtiene todas las categorías de productos.
   * @returns {Observable<CategoriaProducto[]>} Un Observable que emite un array de CategoriaProducto.
   */
  getCategorias(): Observable<CategoriaProducto[]> {
    // Simula una petición GET a la API.
    // En un entorno real: return this.http.get<CategoriaProducto[]>(this.apiUrl);
    return of(this.categorias); // Retorna los datos simulados
  }

  /**
   * @method getCategoriaById
   * @description Obtiene una categoría de producto por su ID.
   * @param {number} id - El ID de la categoría a obtener.
   * @returns {Observable<CategoriaProducto | undefined>} Un Observable que emite la CategoriaProducto encontrada o undefined si no existe.
   */
  getCategoriaById(id: number): Observable<CategoriaProducto | undefined> {
    // Simula una petición GET por ID a la API.
    // En un entorno real: return this.http.get<CategoriaProducto>(`${this.apiUrl}/${id}`);
    return of(this.categorias.find(c => c.CategoriaID === id)); // Busca y retorna la categoría simulada
  }

  /**
   * @method addCategoria
   * @description Agrega una nueva categoría de producto.
   * @param {CategoriaProducto} categoria - La categoría de producto a agregar.
   * @returns {Observable<CategoriaProducto>} Un Observable que emite la categoría agregada (con su ID asignado).
   */
  addCategoria(categoria: CategoriaProducto): Observable<CategoriaProducto> {
    // Simula una petición POST a la API.
    // En un entorno real: return this.http.post<CategoriaProducto>(this.apiUrl, categoria);
    
    // Simula la asignación de un nuevo ID para la categoría
    const newId = this.categorias.length > 0 ? Math.max(...this.categorias.map(c => c.CategoriaID)) + 1 : 1;
    const newCategoria = { ...categoria, CategoriaID: newId };
    this.categorias.push(newCategoria);
    return of(newCategoria); // Retorna la categoría simulada agregada
  }

  /**
   * @method updateCategoria
   * @description Actualiza una categoría de producto existente.
   * @param {CategoriaProducto} categoria - La categoría de producto a actualizar. Debe contener el CategoriaID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateCategoria(categoria: CategoriaProducto): Observable<any> {
    // Simula una petición PUT a la API.
    // En un entorno real: return this.http.put(`${this.apiUrl}/${categoria.CategoriaID}`, categoria);

    const index = this.categorias.findIndex(c => c.CategoriaID === categoria.CategoriaID);
    if (index > -1) {
      this.categorias[index] = categoria; // Actualiza la categoría simulada
      return of(categoria); // Retorna la categoría actualizada
    }
    return of(null); // Simula que no se encontró la categoría
  }

  /**
   * @method deleteCategoria
   * @description Elimina una categoría de producto por su ID.
   * @param {number} id - El ID de la categoría a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteCategoria(id: number): Observable<any> {
    // Simula una petición DELETE a la API.
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);

    this.categorias = this.categorias.filter(c => c.CategoriaID !== id); // Elimina la categoría simulada
    return of(null); // Retorna una respuesta vacía simulada
  }
}