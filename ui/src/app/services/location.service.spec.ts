import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';
import { Location } from '../model/location';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(LocationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to correct URL in listLocations()', () => {
    service.listLocations(null, null);
    let req = httpMock.expectOne(`${LocationService.BASE_URL}`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getLocation()', () => {
    service.getLocation('1', null, null);
    let req = httpMock.expectOne(`${LocationService.BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should make POST request to correct URL in createLocation()', () => {
    service.createLocation(new Location(), null, null);
    let req = httpMock.expectOne(`${LocationService.BASE_URL}`);
    expect(req.request.method).toBe('POST');
  });

  it('should make UPDATE request to correct URL in updateLocation()', () => {
    let location = new Location();
    location.id = 1;
    service.updateLocation(location, null, null);
    let req = httpMock.expectOne(`${LocationService.BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make DELETE request to correct URL in deleteLocation()', () => {
    service.deleteLocation(1, null, null);
    let req = httpMock.expectOne(`${LocationService.BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
