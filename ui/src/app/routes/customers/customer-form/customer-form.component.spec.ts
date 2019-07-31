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

  it('should check password validity', () => {
    component.password = 'short1@E';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'aoejwofe1@Ejaewfdcawefawdfeawfawefawefawefawefawefafawfeaewfaoifjeauyqao9eyhfao93wy8ewb ry4ra wor8eawrfwyhreauihrfeoyaeor8fyawewoiueoraiyueorfiauyweorfiyauweoauwoerfuoaiwfueyaoiewhfadjnfakiwefhawdfliahewflihawdleihfabnflaiwhfeliawhfeawf';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'NOLOWERCASE123!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'nouppercase123!!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'NoNumber!!!!!!!!!!!!!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'N0Sp3c14lCh4r50hN0';
    expect(component.validatePassword()).toBeTruthy();
    component.password = "ValidPassword123!!!"
    expect(component.validatePassword()).toBe(null);
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.callThrough();

    component.name = '';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateUserId').and.callThrough();

    component.name = 'Valid Name';
    component.userId = '';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validatePassword').and.callThrough();

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = '';
    component.priority = 1;
    component.submitButton();
    
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate priority, no creation if invalid', () => {
    spyOn(component, 'validatePriority').and.callThrough();

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = -1;
    component.submitButton();
    
    expect(component.validatePriority).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should call customerService.createCustomer() for valid inputs', () => {
    spyOn(component, 'validateName').and.callThrough();
    spyOn(component, 'validateUserId').and.callThrough();
    spyOn(component, 'validatePassword').and.callThrough();
    spyOn(component, 'validatePriority').and.callThrough();

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    spyOn(service, 'createCustomer');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.validatePriority).toHaveBeenCalled();
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

  it('should check password validity', () => {
    component.password = 'short1@E';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'aoejwofe1@Ejaewfdcawefawdfeawfawefawefawefawefawefafawfeaewfaoifjeauyqao9eyhfao93wy8ewb ry4ra wor8eawrfwyhreauihrfeoyaeor8fyawewoiueoraiyueorfiauyweorfiyauweoauwoerfuoaiwfueyaoiewhfadjnfakiwefhawdfliahewflihawdleihfabnflaiwhfeliawhfeawf';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'NOLOWERCASE123!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'nouppercase123!!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'NoNumber!!!!!!!!!!!!!!!';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'N0Sp3c14lCh4r50hN0';
    expect(component.validatePassword()).toBeTruthy();
    component.password = 'ValidPassword123!!!';
    expect(component.validatePassword()).toBe(null);
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.callThrough();

    component.name = '';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateUserId').and.callThrough();

    component.name = 'Valid Name';
    component.userId = '';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validatePassword').and.callThrough();

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = '';
    component.priority = 1;
    component.submitButton();

    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should validate priority, no creation if invalid', () => {
    spyOn(component, 'validatePriority').and.callThrough();

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = -1;
    component.submitButton();
    
    expect(component.validatePriority).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${CustomerService.BASE_URL}`);
  })

  it('should call customerService.updateCustomer() for valid inputs', () => {
    spyOn(component, 'validateName').and.callThrough();
    spyOn(component, 'validateUserId').and.callThrough();
    spyOn(component, 'validatePassword').and.callThrough();
    spyOn(component, 'validatePriority').and.callThrough();
    spyOn(service, 'updateCustomer');

    component.name = 'Valid Name';
    component.userId = 'validUserId';
    component.password = 'ValidPassword123!!!';
    component.priority = 1;
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.validatePriority).toHaveBeenCalled();
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
