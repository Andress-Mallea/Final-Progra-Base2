import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cliente } from '../models/cliente.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Cliente.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'api/clientes'; // URL de ejemplo para la API de clientes

  // Datos simulados para demostración
  private clientes: Cliente[] = [
    {
      UsuarioID: 1,
      Nombre: 'Ana',
      Apellido: 'García',
      Email: 'ana.garcia@example.com',
      Telefono: '111-222-3333',
      ContrasenaHash: 'hashedpass1',
      FechaDeRegistro: new Date('2024-01-01T10:00:00Z'),
      Activo: true,
      ClienteID: 1,
      Direccion: 'Calle Falsa 123',
      Ciudad: 'Springfield',
      CodigoPostal: '12345'
    }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getClientes
   * @description Obtiene todos los clientes.
   * @returns {Observable<Cliente[]>} Un Observable que emite un array de Cliente.
   */
  getClientes(): Observable<Cliente[]> {
    // En un entorno real: return this.http.get<Cliente[]>(this.apiUrl);
    return of(this.clientes);
  }

  /**
   * @method getClienteById
   * @description Obtiene un cliente por su ClienteID.
   * @param {number} id - El ClienteID del cliente a obtener.
   * @returns {Observable<Cliente | undefined>} Un Observable que emite el Cliente encontrado o undefined.
   */
  getClienteById(id: number): Observable<Cliente | undefined> {
    // En un entorno real: return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
    return of(this.clientes.find(c => c.ClienteID === id));
  }

  /**
   * @method addCliente
   * @description Agrega un nuevo cliente.
   * @param {Cliente} cliente - El cliente a agregar.
   * @returns {Observable<Cliente>} Un Observable que emite el cliente agregado (con su ClienteID asignado).
   */
  addCliente(cliente: Cliente): Observable<Cliente> {
    // En un entorno real: return this.http.post<Cliente>(this.apiUrl, cliente);
    const newId = this.clientes.length > 0 ? Math.max(...this.clientes.map(c => c.ClienteID)) + 1 : 1;
    const newCliente = { ...cliente, ClienteID: newId, UsuarioID: newId }; // Simula UsuarioID también
    this.clientes.push(newCliente);
    return of(newCliente);
  }

  /**
   * @method updateCliente
   * @description Actualiza un cliente existente.
   * @param {Cliente} cliente - El cliente a actualizar. Debe contener el ClienteID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateCliente(cliente: Cliente): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${cliente.ClienteID}`, cliente);
    const index = this.clientes.findIndex(c => c.ClienteID === cliente.ClienteID);
    if (index > -1) {
      this.clientes[index] = cliente;
      return of(cliente);
    }
    return of(null);
  }

  /**
   * @method deleteCliente
   * @description Elimina un cliente por su ClienteID.
   * @param {number} id - El ClienteID del cliente a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteCliente(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.clientes = this.clientes.filter(c => c.ClienteID !== id);
    return of(null);
  }
}
