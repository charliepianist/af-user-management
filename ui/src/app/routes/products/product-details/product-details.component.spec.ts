import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { ProductService } from 'src/app/services/product.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Product } from 'src/app/model/product';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let injector: TestBed;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsComponent, 
        DeleteConfirmationComponent],
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
    service = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no product object on error', () => {
    const req = httpMock.expectOne(`${ProductService.BASE_URL}/3`);
    req.error(new ErrorEvent('Network error'));
    
    expect(component.product).toBeFalsy();
  });

  it('should call productService.deleteProduct() on delete', () => {
    let product = new Product(3, 'name');
    component.product = product;

    spyOn(service, 'deleteProduct');
    component.deleteProduct();
    expect(service.deleteProduct).toHaveBeenCalled();
  });
});
