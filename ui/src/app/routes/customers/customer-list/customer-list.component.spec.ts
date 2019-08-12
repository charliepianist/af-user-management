import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { CustomerListComponent } from './customer-list.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { CustomerService } from 'src/app/services/customer.service';
import { Page } from 'src/app/model/page';
import { Customer } from 'src/app/model/customer';
import { Pageable } from 'src/app/model/pageable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { TooltipComponent } from 'src/app/components/tooltip/tooltip.component';

describe('CustomerListComponent without Query parameters', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let injector: TestBed;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CustomerListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent,
        TooltipComponent
      ],
      imports: [
        TestingModule,
      ],
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(CustomerService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process empty array of customers', () => {
    expect(component).toBeTruthy();
    
    const customerPage = new Page<Customer>();
    customerPage.content = [];
    customerPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${CustomerService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(customerPage);
    
    expect(component.customerPage).toBe(customerPage);
    expect(component.customers.length).toBe(0);
  });

  it('should correctly process populated array of customers', () => {
    expect(component).toBeTruthy();
    
    const customerPage = new Page<Customer>();
    // 8 filler customers
    customerPage.content = [new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer()];
    customerPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${CustomerService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(customerPage);
    
    expect(component.customerPage).toBe(customerPage);
    expect(component.customers.length).toBe(8);
    expect(component.customers[0] instanceof Customer).toBe(true);
  });

  it('should have errorMsg variable and no customers or page on error', () => {
    const customerPage = new Page<Customer>();
    customerPage.content = [];
    customerPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${CustomerService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.error(new ErrorEvent('network error'));

    expect(component.errorMsg).toBeTruthy();
    expect(component.customerPage).toBeFalsy();
    expect(component.customers).toBeFalsy();
  });

  it('should call deleteCustomer() when delete function called', () => {
    spyOn(service, 'deleteCustomer');
    component.deleteCustomer(1);
    expect(service.deleteCustomer).toHaveBeenCalled();
  });

  it('should go to default query values', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(CustomerListComponent.DEFAULT_PAGE_SIZE);
    expect(component.queryParams.sortBy).toBe(CustomerListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(false);
    expect(component.queryParams.disabled).toBe(false);
  })
});

describe('CustomerListComponent with invalid query parameters', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let injector: TestBed;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CustomerListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent,
        TooltipComponent
      ],
      imports: [
        TestingModule,
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: new Observable(subscriber => {
            subscriber.next({
              get: (field: string) => {
                switch(field) {
                  case 'page': return '-5';
                  case 'size': return '-2';
                  case 'sortBy': return 'invalidsort';
                  case 'desc': return 'true';
                  case 'disabled': return 'true';
                }
              }
            })
          })
        }
      }]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(CustomerService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate queryParams', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(CustomerListComponent.DEFAULT_PAGE_SIZE);
    expect(component.queryParams.sortBy).toBe(CustomerListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(true);
    expect(component.queryParams.disabled).toBe(true);
  });
});


describe('Customer ListComponent with valid query parameters', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let injector: TestBed;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CustomerListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent,
        TooltipComponent
      ],
      imports: [
        TestingModule,
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: new Observable(subscriber => {
            subscriber.next({
              get: (field: string) => {
                switch(field) {
                  case 'page': return '1';
                  case 'size': return '15';
                  case 'sortBy': return 'id';
                  case 'desc': return 'true';
                  case 'disabled': return 'true';
                }
              }
            })
          })
        }
      }]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(CustomerService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct queryParams and call listCustomers()', () => {
    expect(component.queryParams.page).toBe(1);
    expect(component.queryParams.size).toBe(15);
    expect(component.queryParams.sortBy).toBe('id'); 
    expect(component.queryParams.desc).toBe(true);
    expect(component.queryParams.disabled).toBe(true);
    
    spyOn(service, 'listCustomers');
    component.ngOnInit();
    expect(service.listCustomers).toHaveBeenCalledWith(jasmine.any(Function), 
      jasmine.any(Function), component.queryParams)
  });
});
