import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { PersonDetailsComponent } from './person-details.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { PersonService } from 'src/app/services/person.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Person } from 'src/app/model/person';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';

describe('PersonDetailsComponent', () => {
  let component: PersonDetailsComponent;
  let fixture: ComponentFixture<PersonDetailsComponent>;
  let injector: TestBed;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDetailsComponent ],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable( subscriber =>
            subscriber.next({
              get: () => {
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
    service = injector.get(PersonService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly process a returned person', () => {

    expect(component).toBeTruthy();
    
    const person = new Person(3, 'Name', 'User ID', 'a!2Edfawofjipasdofjpoawfj');

    const req = httpMock.expectOne(`${PersonService.BASE_URL}/3`);
    expect(req.request.method).toBe("GET");
    req.flush(person);
    
    expect(component.person).toEqual(person);
  });

  it('should have no person object on error', () => {
    const req = httpMock.expectOne(`${PersonService.BASE_URL}/3`);
    req.error(new ErrorEvent('Network error'));
    
    expect(component.person).toBeFalsy();
  });

  it('should call personService.deletePerson() on delete', () => {
    let person = new Person(3, 'name', 'uid', 'awefhafuaoi!23RRGFasa');
    const req = httpMock.expectOne(`${PersonService.BASE_URL}/3`);
    req.flush(person);

    spyOn(service, 'deletePerson');
    component.deletePerson();
    expect(service.deletePerson).toHaveBeenCalled();
  });
});
