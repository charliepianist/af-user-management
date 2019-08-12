import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { CustomerDetailsComponent } from './customer-details.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { CustomerService } from 'src/app/services/customer.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Customer } from 'src/app/model/customer';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { CustomerEntitlementsComponent } from '../customer-entitlements/customer-entitlements.component';
import { TooltipComponent } from 'src/app/components/tooltip/tooltip.component';

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;
  let injector: TestBed;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailsComponent, 
        DeleteConfirmationComponent,
        CustomerEntitlementsComponent,
        TooltipComponent],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable( subscriber =>
            subscriber.next({
              get: (field: string) => {
                return 3;
              }
            })
          )
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(CustomerService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no customer object on error', () => {
    const req = httpMock.expectOne(`${CustomerService.BASE_URL}/3`);
    req.error(new ErrorEvent('Network error'));
    
    expect(component.customer).toBeFalsy();
  });

  it('should call customerService.deleteCustomer() on delete', () => {
    let customer = new Customer(3, 'name', 'uid', 'awefhafuaoi!23RRGFasa');
    component.customer = customer;

    spyOn(service, 'deleteCustomer');
    component.deleteCustomer();
    expect(service.deleteCustomer).toHaveBeenCalled();
  });
});
