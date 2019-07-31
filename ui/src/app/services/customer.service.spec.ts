import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';
import { Customer } from '../model/customer';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(CustomerService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to correct URL in listCustomers()', () => {
    service.listCustomers(null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getCustomer()', () => {
    service.getCustomer('1', null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getCustomerEntitlements()', () => {
    service.getCustomerEntitlements('1', null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}/1/entitlements`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URLs in getCustomerWithEntitlements()', () => {
    service.getCustomerWithEntitlements('1', null, null);
    let req1 = httpMock.expectOne(`${CustomerService.BASE_URL}/1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(new Customer());
    let req2 = httpMock.expectOne(`${CustomerService.BASE_URL}/1/entitlements`);
    expect(req2.request.method).toBe('GET');
  });

  it('should make POST request to correct URL in createCustomer()', () => {
    service.createCustomer(new Customer(), null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}`);
    expect(req.request.method).toBe('POST');
  });

  it('should make PUT request to correct URL in updateCustomer()', () => {
    let customer = new Customer();
    customer.id = 1;
    service.updateCustomer(customer, null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make PUT request to correct URL in updateCustomerEntitlements()', () => {
    service.updateCustomerEntitlements(1, [], null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}/1/entitlements`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make DELETE request to correct URL in deleteCustomer()', () => {
    service.deleteCustomer(1, null, null);
    let req = httpMock.expectOne(`${CustomerService.BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
