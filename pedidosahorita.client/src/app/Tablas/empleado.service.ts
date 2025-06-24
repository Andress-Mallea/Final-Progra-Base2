import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Empleado } from '../models/empleado.model';

/**
 * @injectable
 * @description Servicio para gestionar las operaciones CRUD de Empleado.
 * Simula interacciones con un backend.
 */
@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'api/empleados'; // URL de ejemplo para la API de empleados

  // Datos simulados para demostración
  private empleados: Empleado[] = [
    {
      UsuarioID: 2,
      Nombre: 'Carlos',
      Apellido: 'Ruiz',
      Email: 'carlos.ruiz@example.com',
      Telefono: '444-555-6666',
      ContrasenaHash: 'hashedpass2',
      FechaDeRegistro: new Date('2024-02-15T11:30:00Z'),
      Activo: true,
      EmpleadoID: 101,
      FechaDeContratacion: new Date('2023-01-20'),
      RolInterno: 'Repartidor',
      Salario: 1500.00
    }
  ];

  /**
   * @constructor
   * @param {HttpClient} http - Inyecta el servicio HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getEmpleados
   * @description Obtiene todos los empleados.
   * @returns {Observable<Empleado[]>} Un Observable que emite un array de Empleado.
   */
  getEmpleados(): Observable<Empleado[]> {
    // En un entorno real: return this.http.get<Empleado[]>(this.apiUrl);
    return of(this.empleados);
  }

  /**
   * @method getEmpleadoById
   * @description Obtiene un empleado por su EmpleadoID.
   * @param {number} id - El EmpleadoID del empleado a obtener.
   * @returns {Observable<Empleado | undefined>} Un Observable que emite el Empleado encontrado o undefined.
   */
  getEmpleadoById(id: number): Observable<Empleado | undefined> {
    // En un entorno real: return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
    return of(this.empleados.find(e => e.EmpleadoID === id));
  }

  /**
   * @method addEmpleado
   * @description Agrega un nuevo empleado.
   * @param {Empleado} empleado - El empleado a agregar.
   * @returns {Observable<Empleado>} Un Observable que emite el empleado agregado (con su EmpleadoID asignado).
   */
  addEmpleado(empleado: Empleado): Observable<Empleado> {
    // En un entorno real: return this.http.post<Empleado>(this.apiUrl, empleado);
    const newId = this.empleados.length > 0 ? Math.max(...this.empleados.map(e => e.EmpleadoID)) + 1 : 1;
    const newEmpleado = { ...empleado, EmpleadoID: newId, UsuarioID: newId }; // Simula UsuarioID también
    this.empleados.push(newEmpleado);
    return of(newEmpleado);
  }

  /**
   * @method updateEmpleado
   * @description Actualiza un empleado existente.
   * @param {Empleado} empleado - El empleado a actualizar. Debe contener el EmpleadoID.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  updateEmpleado(empleado: Empleado): Observable<any> {
    // En un entorno real: return this.http.put(`${this.apiUrl}/${empleado.EmpleadoID}`, empleado);
    const index = this.empleados.findIndex(e => e.EmpleadoID === empleado.EmpleadoID);
    if (index > -1) {
      this.empleados[index] = empleado;
      return of(empleado);
    }
    return of(null);
  }

  /**
   * @method deleteEmpleado
   * @description Elimina un empleado por su EmpleadoID.
   * @param {number} id - El EmpleadoID del empleado a eliminar.
   * @returns {Observable<any>} Un Observable que emite una respuesta vacía o un indicador de éxito.
   */
  deleteEmpleado(id: number): Observable<any> {
    // En un entorno real: return this.http.delete(`${this.apiUrl}/${id}`);
    this.empleados = this.empleados.filter(e => e.EmpleadoID !== id);
    return of(null);
  }
}