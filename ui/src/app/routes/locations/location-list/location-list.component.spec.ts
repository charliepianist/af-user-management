import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { TestingModule } from 'src/app/test/TestingModule';
import { LocationService } from 'src/app/services/location.service';
import { Page } from 'src/app/model/page';
import { Location } from 'src/app/model/location';
import { Pageable } from 'src/app/model/pageable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { LocationListComponent } from './location-list.component';

describe('LocationListComponent without Query parameters', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let injector: TestBed;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LocationListComponent, 
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
    service = injector.get(LocationService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process empty array of locations', () => {
    expect(component).toBeTruthy();
    
    const locationPage = new Page<Location>();
    locationPage.content = [];
    locationPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${LocationService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(locationPage);
    
    expect(component.locationPage).toBe(locationPage);
    expect(component.locations.length).toBe(0);
  });

  it('should correctly process populated array of locations', () => {
    expect(component).toBeTruthy();
    
    const locationPage = new Page<Location>();
    // 8 filler locations
    locationPage.content = [new Location(), new Location(), new Location(), new Location(), new Location(), new Location(), new Location(), new Location()];
    locationPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${LocationService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(locationPage);
    
    expect(component.locationPage).toBe(locationPage);
    expect(component.locations.length).toBe(8);
    expect(component.locations[0] instanceof Location).toBe(true);
  });

  it('should have errorMsg variable and no locations or page on error', () => {
    const locationPage = new Page<Location>();
    locationPage.content = [];
    locationPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${LocationService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.error(new ErrorEvent('network error'));

    expect(component.errorMsg).toBeTruthy();
    expect(component.locationPage).toBeFalsy();
    expect(component.locations).toBeFalsy();
  });

  it('should call deleteLocation() when delete function called', () => {
    spyOn(service, 'deleteLocation');
    component.deleteLocation(1);
    expect(service.deleteLocation).toHaveBeenCalled();
  });

  it('should go to default query values', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(LocationListComponent.DEFAULT_PAGE_SIZE)
    expect(component.queryParams.sortBy).toBe(LocationListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(false);
  })
});

describe('LocationListComponent with invalid query parameters', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let injector: TestBed;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LocationListComponent, 
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
    service = injector.get(LocationService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate queryParams', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(LocationListComponent.DEFAULT_PAGE_SIZE);
    expect(component.queryParams.sortBy).toBe(LocationListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(true);
  });
});


describe('Location ListComponent with valid query parameters', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let injector: TestBed;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LocationListComponent, 
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
    service = injector.get(LocationService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct queryParams and call listLocations()', () => {
    expect(component.queryParams.page).toBe(1);
    expect(component.queryParams.size).toBe(15);
    expect(component.queryParams.sortBy).toBe('id'); 
    expect(component.queryParams.desc).toBe(true);
    
    spyOn(service, 'listLocations');
    component.ngOnInit();
    expect(service.listLocations).toHaveBeenCalledWith(jasmine.any(Function), 
      jasmine.any(Function), component.queryParams)
  });
});
