import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { TestingModule } from 'src/app/test/TestingModule';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { Page } from 'src/app/model/page';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { Pageable } from 'src/app/model/pageable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { MulticastGroupListComponent } from './multicast-group-list.component';

describe('MulticastGroupListComponent without Query parameters', () => {
  let component: MulticastGroupListComponent;
  let fixture: ComponentFixture<MulticastGroupListComponent>;
  let injector: TestBed;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MulticastGroupListComponent, 
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
    service = injector.get(MulticastGroupService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process empty array of multicastGroups', () => {
    expect(component).toBeTruthy();
    
    const multicastGroupPage = new Page<MulticastGroup>();
    multicastGroupPage.content = [];
    multicastGroupPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${MulticastGroupService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(multicastGroupPage);
    
    expect(component.multicastGroupPage).toBe(multicastGroupPage);
    expect(component.multicastGroups.length).toBe(0);
  });

  it('should correctly process populated array of multicastGroups', () => {
    expect(component).toBeTruthy();
    
    const multicastGroupPage = new Page<MulticastGroup>();
    // 8 filler multicastGroups
    multicastGroupPage.content = [new MulticastGroup(), new MulticastGroup(), new MulticastGroup(), new MulticastGroup(), new MulticastGroup(), new MulticastGroup(), new MulticastGroup(), new MulticastGroup()];
    multicastGroupPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${MulticastGroupService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(multicastGroupPage);
    
    expect(component.multicastGroupPage).toBe(multicastGroupPage);
    expect(component.multicastGroups.length).toBe(8);
    expect(component.multicastGroups[0] instanceof MulticastGroup).toBe(true);
  });

  it('should have errorMsg variable and no multicastGroups or page on error', () => {
    const multicastGroupPage = new Page<MulticastGroup>();
    multicastGroupPage.content = [];
    multicastGroupPage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${MulticastGroupService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.error(new ErrorEvent('network error'));

    expect(component.errorMsg).toBeTruthy();
    expect(component.multicastGroupPage).toBeFalsy();
    expect(component.multicastGroups).toBeFalsy();
  });

  it('should call deleteMulticastGroup() when delete function called', () => {
    spyOn(service, 'deleteMulticastGroup');
    component.deleteMulticastGroup(1);
    expect(service.deleteMulticastGroup).toHaveBeenCalled();
  });

  it('should go to default query values', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(MulticastGroupListComponent.DEFAULT_PAGE_SIZE)
    expect(component.queryParams.sortBy).toBe(MulticastGroupListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(false);
  })
});

describe('MulticastGroupListComponent with invalid query parameters', () => {
  let component: MulticastGroupListComponent;
  let fixture: ComponentFixture<MulticastGroupListComponent>;
  let injector: TestBed;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MulticastGroupListComponent, 
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
    service = injector.get(MulticastGroupService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate queryParams', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBe(MulticastGroupListComponent.DEFAULT_PAGE_SIZE);
    expect(component.queryParams.sortBy).toBe(MulticastGroupListComponent.DEFAULT_SORT_FIELD); 
    expect(component.queryParams.desc).toBe(true);
  });
});


describe('MulticastGroup ListComponent with valid query parameters', () => {
  let component: MulticastGroupListComponent;
  let fixture: ComponentFixture<MulticastGroupListComponent>;
  let injector: TestBed;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MulticastGroupListComponent, 
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
    service = injector.get(MulticastGroupService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct queryParams and call listMulticastGroups()', () => {
    expect(component.queryParams.page).toBe(1);
    expect(component.queryParams.size).toBe(15);
    expect(component.queryParams.sortBy).toBe('id'); 
    expect(component.queryParams.desc).toBe(true);
    
    spyOn(service, 'listMulticastGroups');
    component.ngOnInit();
    expect(service.listMulticastGroups).toHaveBeenCalledWith(jasmine.any(Function), 
      jasmine.any(Function), component.queryParams)
  });
});
