import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { PersonListComponent } from './person-list.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { PersonService } from 'src/app/services/person.service';
import { Page } from 'src/app/model/page';
import { Person } from 'src/app/model/person';
import { Pageable } from 'src/app/model/pageable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';

describe('PersonListComponent without Query parameters', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let injector: TestBed;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonListComponent ],
      imports: [
        TestingModule,
      ],
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(PersonService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process empty array of people', () => {
    expect(component).toBeTruthy();
    
    const peoplePage = new Page<Person>();
    peoplePage.content = [];
    peoplePage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${PersonService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(peoplePage);
    
    expect(component.people.length).toBe(0);
  });

  it('should correctly process populated array of people', () => {
    expect(component).toBeTruthy();
    
    const peoplePage = new Page<Person>();
    // 10 filler people
    peoplePage.content = [new Person(), new Person(), new Person(), new Person(), new Person(), new Person(), new Person(), new Person(), new Person(), new Person()];
    peoplePage.pageable = new Pageable();
    peoplePage.numberOfElements = 10;
    peoplePage.totalElements = 25;
    peoplePage.pageable.offset = 10;
    peoplePage.number = 1; // Spring page index starts at 0
    peoplePage.totalPages = 3;

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${PersonService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.flush(peoplePage);
    
    // Elements 11 to 20 of 25, page 2 of 3
    expect(component.people.length).toBe(10);
    expect(component.startElement).toBe(11);
    expect(component.endElement).toBe(20);
    expect(component.totalElements).toBe(25);
    expect(component.peoplePage).toEqual(peoplePage);
    expect(component.pageNumber).toBe(2);
    expect(component.totalPages).toBe(3);
  });

  it('should have errorMsg variable and no people or page on error', () => {
    const peoplePage = new Page<Person>();
    peoplePage.content = [];
    peoplePage.pageable = new Pageable();

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      return request.url === `${PersonService.BASE_URL}`;
    });
    expect(req.request.method).toBe("GET");
    req.error(new ErrorEvent('network error'));

    expect(component.errorMsg).toBeTruthy();
    expect(component.peoplePage).toBeFalsy();
    expect(component.people).toBeFalsy();
  });

  it('should call deletePerson() when delete function called', () => {
    spyOn(service, 'deletePerson');
    component.deletePerson(1);
    expect(service.deletePerson).toHaveBeenCalled();
  });

  it('should go to default query values', () => {
    // current defaults:
    // page: 0 (should not change)
    // size: 20
    // sortBy: 'id'
    // desc: false
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBeGreaterThan(0);
    expect(component.queryParams.sortBy).toBeTruthy(); 
    expect(component.queryParams.desc).toBe(false);
  })
});

describe('PersonListComponent with invalid query parameters', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let injector: TestBed;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonListComponent ],
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
    service = injector.get(PersonService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate queryParams', () => {
    expect(component.queryParams.page).toBe(0);
    expect(component.queryParams.size).toBeGreaterThan(0);
    expect(component.queryParams.sortBy).toBeTruthy(); 
    expect(component.queryParams.desc).toBe(true);
  });
});


describe('PersonListComponent with valid query parameters', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let injector: TestBed;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonListComponent ],
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
                  case 'sortBy': return 'name';
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
    service = injector.get(PersonService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct queryParams and call listPeople', () => {
    expect(component.queryParams.page).toBe(1);
    expect(component.queryParams.size).toBeGreaterThan(0);
    expect(component.queryParams.sortBy).toBeTruthy(); 
    expect(component.queryParams.desc).toBe(true);
    
    spyOn(service, 'listPeople');
    component.ngOnInit();
    expect(service.listPeople).toHaveBeenCalledWith(jasmine.any(Function), 
      jasmine.any(Function), component.queryParams)
  });
});
