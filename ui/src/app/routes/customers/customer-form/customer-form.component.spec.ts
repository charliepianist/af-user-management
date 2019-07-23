import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFormComponent } from './customer-form.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { FormsModule } from '@angular/forms';
import { HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerEntitlementsComponent } from '../customer-entitlements/customer-entitlements.component';



describe('Creating new Customer', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFormComponent, CustomerEntitlementsComponent ],
      imports: [
        TestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(CustomerService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a set ID', () => {
    expect(component.id).toBeFalsy();
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue('error');
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue('error');
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should call customerService.createCustomer() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    spyOn(service, 'createCustomer');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(service.createCustomer).toHaveBeenCalled();
  })
});

describe('Updating Customer', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFormComponent, CustomerEntitlementsComponent ],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable(subscriber => {
            subscriber.next({
              get: (field: string) => {
                return '1';
              }
            });
          })
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(CustomerService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a set ID', () => {
    expect(component.id).toBe('1');
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue('error');
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue('error');
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should call customerService.updateCustomer() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    spyOn(service, 'updateCustomer');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(service.updateCustomer).toHaveBeenCalled();
  })

  it('should call customerService.updateCustomerEntitlements() for valid inputs', () => {
    component.updateEntitlements = true;
    spyOn(component.customerEntitlementsComponent, 'getEntitlements').and.returnValue([]);
    spyOn(service, 'updateCustomerEntitlements');
    component.submitButton();

    expect(component.customerEntitlementsComponent.getEntitlements).toHaveBeenCalled();
    expect(service.updateCustomerEntitlements).toHaveBeenCalled();
  })
});
