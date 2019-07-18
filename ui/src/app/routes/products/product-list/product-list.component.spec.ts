import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { TestingModule } from 'src/app/test/TestingModule';
import { ProductService } from 'src/app/services/product.service';
import { Page } from 'src/app/model/page';
import { Product } from 'src/app/model/product';
import { Pageable } from 'src/app/model/pageable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent without Query parameters', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let injector: TestBed;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProductListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent 
      ],
      imports: [
        TestingModule,
      ],
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process empty array of products', () => {
    expect(component).toBeTruthy();
    
    const productPage = new Page<Product>();
    productPage.content = [];
    productPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${ProductService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(productPage);
    
    expect(component.productPage).toBe(productPage);
    expect(component.products.length).toBe(0);
  });

  it('should correctly process populated array of products', () => {
    expect(component).toBeTruthy();
    
    const productPage = new Page<Product>();
    // 8 filler products
    productPage.content = [new Product(), new Product(), new Product(), new Product(), new Product(), new Product(), new Product(), new Product()];
    productPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${ProductService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(productPage);
    
    expect(component.productPage).toBe(productPage);
    expect(component.products.length).toBe(8);
    expect(component.products[0] instanceof Product).toBe(true);
  });

  it('should have errorMsg variable and no products or page on error', () => {
    const productPage = new Page<Product>();
    productPage.content = [];
    productPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${ProductService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.error(new ErrorEvent('network error'));

    expect(component.errorMsg).toBeTruthy();
    expect(component.productPage).toBeFalsy();
    expect(component.products).toBeFalsy();
  });

  it('should call deleteProduct() when delete function called', () => {
    spyOn(service, 'deleteProduct');
    component.deleteProduct(1);
    expect(service.deleteProduct).toHaveBeenCalled();
  });

  it('should go to default query values', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(ProductListComponent.DEFAULT_PAGE_SIZE)
    expect(component.queryParams.sortBy).toBe(ProductListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(false);
  })
});

describe('ProductListComponent with invalid query parameters', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let injector: TestBed;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProductListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent
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
    service = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate queryParams', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(ProductListComponent.DEFAULT_PAGE_SIZE);
    expect(component.queryParams.sortBy).toBe(ProductListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(true);
  });
});


describe('Product ListComponent with valid query parameters', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let injector: TestBed;
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProductListComponent, 
        PaginatorComponent,
        DeleteConfirmationComponent
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
    service = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct queryParams and call listProducts()', () => {
    expect(component.queryParams.page).toBe(1);
    expect(component.queryParams.size).toBe(15);
    expect(component.queryParams.sortBy).toBe('id'); 
    expect(component.queryParams.desc).toBe(true);
    
    spyOn(service, 'listProducts');
    component.ngOnInit();
    expect(service.listProducts).toHaveBeenCalledWith(jasmine.any(Function), 
      jasmine.any(Function), component.queryParams)
  });
});
