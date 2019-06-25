import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { PersonListComponent } from './person-list.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { PersonService } from 'src/app/services/person.service';
import { Page } from 'src/app/model/page';
import { Person } from 'src/app/model/person';
import { Pageable } from 'src/app/model/pageable';

describe('PersonListComponent', () => {
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

    const req = httpMock.expectOne(`${PersonService.BASE_URL}`);
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

    const req = httpMock.expectOne(`${PersonService.BASE_URL}`);
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

    const req = httpMock.expectOne(`${PersonService.BASE_URL}`);
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

  it('TODO: Test Sorting? (Making correct calls given URL Params)', () => {
    expect(0).toBe(1);
  })
});
