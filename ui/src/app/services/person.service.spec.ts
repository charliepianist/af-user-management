import { TestBed } from '@angular/core/testing';

import { PersonService } from './person.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';
import { Person } from '../model/person';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(PersonService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to correct URL in listPeople()', () => {
    service.listPeople(null, null);
    let req = httpMock.expectOne(`${PersonService.BASE_URL}`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getPerson()', () => {
    service.getPerson('1', null, null);
    let req = httpMock.expectOne(`${PersonService.BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should make POST request to correct URL in createPerson()', () => {
    service.createPerson(new Person(), null, null);
    let req = httpMock.expectOne(`${PersonService.BASE_URL}`);
    expect(req.request.method).toBe('POST');
  });

  it('should make UPDATE request to correct URL in updatePerson()', () => {
    let person = new Person();
    person.id = 1;
    service.updatePerson(person, null, null);
    let req = httpMock.expectOne(`${PersonService.BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make DELETE request to correct URL in deletePerson()', () => {
    service.deletePerson(1, null, null);
    let req = httpMock.expectOne(`${PersonService.BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
