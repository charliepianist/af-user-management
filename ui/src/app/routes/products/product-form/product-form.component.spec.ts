import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { FormsModule } from '@angular/forms';
import { HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


describe('Creating new Product', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFormComponent ],
      imports: [
        TestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(ProductService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductFormComponent);
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
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${ProductService.BASE_URL}`);
  })

  it('should call productService.createProduct() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(service, 'createProduct');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(service.createProduct).toHaveBeenCalled();
  })
});

describe('Updating Product', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFormComponent ],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable(subscriber => {
            subscriber.next({
              get: () => {
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
    service = TestBed.get(ProductService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductFormComponent);
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
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${ProductService.BASE_URL}`);
  })

  it('should call productService.updateProduct() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(service, 'updateProduct');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(service.updateProduct).toHaveBeenCalled();
  })
});
