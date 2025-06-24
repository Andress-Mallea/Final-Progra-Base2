// filepath: src/app/producto.service.spec.ts
import { TestBed } from '@angular/core/testing';

import { ProductService } from './producto.service'; // Importa ProductService

describe('ProductService', () => {
  let service: ProductService; // Usa ProductService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService); // Usa ProductService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});