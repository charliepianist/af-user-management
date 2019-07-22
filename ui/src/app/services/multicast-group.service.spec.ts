import { TestBed } from '@angular/core/testing';

import { MulticastGroupService } from './multicast-group.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';
import { MulticastGroup } from '../model/multicast-group';

describe('MulticastGroupService', () => {
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(MulticastGroupService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request to correct URL in listMulticastGroups()', () => {
    service.listMulticastGroups(null, null);
    let req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}`);
    expect(req.request.method).toBe('GET');
  });

  it('should make GET request to correct URL in getMulticastGroup()', () => {
    service.getMulticastGroup('1', null, null);
    let req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should make POST request to correct URL in createMulticastGroup()', () => {
    service.createMulticastGroup(new MulticastGroup(), null, null);
    let req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}`);
    expect(req.request.method).toBe('POST');
  });

  it('should make UPDATE request to correct URL in updateMulticastGroup()', () => {
    let multicastGroup = new MulticastGroup();
    multicastGroup.id = 1;
    service.updateMulticastGroup(multicastGroup, null, null);
    let req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
  });

  it('should make DELETE request to correct URL in deleteMulticastGroup()', () => {
    service.deleteMulticastGroup(1, null, null);
    let req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
