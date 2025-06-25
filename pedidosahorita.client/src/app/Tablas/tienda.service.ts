import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tienda } from '../models/tienda.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Tienda (Vendedor).
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiUrl = 'api/tiendas'; // URL de ejemplo para la API de tiendas

  // Datos simulados para demostración
  private tiendas: Tienda[] = [
    // Asumiendo que VendedorID es el mismo que UsuarioID para simplificar
    { UsuarioID: 3, Nombre: 'Carlos', Apellido: 'Lopez', Email: 'carlos@example.com', Telefono: '', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-03-15'), Activo: true, VendedorID: 3, NombreDeTienda: 'GadgetZone', CuentaDeBanco: 'BANK12345'},
    { UsuarioID: 1, Nombre: 'Juan', Apellido: 'Perez', Email: 'juan@example.com', Telefono: '111-222-3333', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-01-01'), Activo: true, VendedorID: 1, NombreDeTienda: 'TechHub', CuentaDeBanco: 'BANK67890'}, // Cliente que también es vendedor
    // Nuevas tiendas añadidas:
    { UsuarioID: 4, Nombre: 'Ana', Apellido: 'Diaz', Email: 'ana@example.com', Telefono: '987-654-3210', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-06-01'), Activo: true, VendedorID: 4, NombreDeTienda: 'EcoVida', CuentaDeBanco: 'ECOBANK001'},
    { UsuarioID: 6, Nombre: 'Luis', Apellido: 'Vega', Email: 'luis@example.com', Telefono: '123-456-7890', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-07-10'), Activo: true, VendedorID: 6, NombreDeTienda: 'LibrosYA', CuentaDeBanco: 'BOOKBANK002'},
    { UsuarioID: 7, Nombre: 'Sofía', Apellido: 'Martínez', Email: 'sofia@example.com', Telefono: '555-111-2222', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-08-15'), Activo: true, VendedorID: 7, NombreDeTienda: 'ModaExpress', CuentaDeBanco: 'FASHIONBANK003'},
    { UsuarioID: 8, Nombre: 'Roberto', Apellido: 'González', Email: 'roberto@example.com', Telefono: '333-444-5555', ContrasenaHash: 'password123', FechaDeRegistro: new Date('2023-09-01'), Activo: true, VendedorID: 8, NombreDeTienda: 'Juguetería Feliz', CuentaDeBanco: 'TOYBANK004'}
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getTiendas
   * @description Obtiene todas las tiendas (vendedores).
   * @returns {Observable<Tienda[]>} Un Observable que emite un array de Tienda.
   */
  getTiendas(): Observable<Tienda[]> {
    // En un entorno real: return this.http.get<Tienda[]>(this.apiUrl);
    return of(this.tiendas);
  }

  /**
   * @method getTiendaById
   * @description Obtiene una tienda por su VendedorID.
   * @param {number} id - El VendedorID de la tienda a obtener.
   * @returns {Observable<Tienda | undefined>} Un Observable que emite la Tienda encontrada o undefined.
   */
  getTiendaById(id: number): Observable<Tienda | undefined> {
    // En un entorno real: return this.http.get<Tienda>(`${this.apiUrl}/${id}`);
    return of(this.tiendas.find(t => t.VendedorID === id));
  }

  /**
   * @method addTienda
   * @description Agrega una nueva tienda (vendedor).
   * @param {Tienda} tienda - La tienda a agregar.
   * @returns {Observable<Tienda>} Un Observable que emite la tienda agregada (con su VendedorID asignado).
   */
  addTienda(tienda: Tienda): Observable<Tienda> {
    // En un entorno real: return this.http.post<Tienda>(this.apiUrl, tienda);
    const newId = this.tiendas.length > 0 ? Math.max(...this.tiendas.map(t => t.VendedorID)) + 1 : 1;
    const newTienda = { ...tienda, VendedorID: newId, UsuarioID: newId }; // Simula UsuarioID también
    this.tiendas.push(newTienda);
    return of(newTienda);
  }

  /**
   * @method updateTienda
   * @description Actualiza una tienda existente.
   * @param {Tienda} tienda - La tienda a actualizar. Debe contener el VendedorID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateTienda(tienda: Tienda): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${tienda.VendedorID}`, tienda);
    const index = this.tiendas.findIndex(t => t.VendedorID === tienda.VendedorID);
    if (index > -1) {
      this.tiendas[index] = tienda;
      return of(tienda);
    }
    return of(null);
  }

  /**
   * @method deleteTienda
   * @description Elimina una tienda por su VendedorID.
   * @param {number} id - El VendedorID de la tienda a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteTienda(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.tiendas = this.tiendas.filter(t => t.VendedorID !== id);
    return of(null);
  }
}