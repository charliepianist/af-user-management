import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../model/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(ProductService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to correct URL in listProducts()', () => {
    service.listProducts(null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getProduct()', () => {
    service.getProduct('1', null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getProductMulticastGroups()', () => {
    service.getProductMulticastGroups('1', null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}/1/multicast-groups`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URLs in getProductWithMulticastGroups()', () => {
    service.getProductWithMulticastGroups('1', null);
    let req1 = httpMock.expectOne(`${ProductService.BASE_URL}/1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(new Product());
    let req2 = httpMock.expectOne(`${ProductService.BASE_URL}/1/multicast-groups`);
    expect(req2.request.method).toBe('GET');
  });

  it('should make POST request to correct URL in createProduct()', () => {
    service.createProduct(new Product(), null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}`);
    expect(req.request.method).toBe('POST');
  });

  it('should make PUT request to correct URL in updateProduct()', () => {
    let product = new Product();
    product.id = 1;
    service.updateProduct(product, null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make PUT request to correct URL in updateProductMulticastGroups()', () => {
    service.updateProductMulticastGroups(1, [], null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}/1/multicast-groups`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make DELETE request to correct URL in deleteProduct()', () => {
    service.deleteProduct(1, null, null);
    let req = httpMock.expectOne(`${ProductService.BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
