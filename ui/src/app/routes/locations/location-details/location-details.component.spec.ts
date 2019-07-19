import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { LocationDetailsComponent } from './location-details.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { LocationService } from 'src/app/services/location.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Location } from 'src/app/model/location';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';

describe('LocationDetailsComponent', () => {
  let component: LocationDetailsComponent;
  let fixture: ComponentFixture<LocationDetailsComponent>;
  let injector: TestBed;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDetailsComponent, 
        DeleteConfirmationComponent],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable( subscriber =>
            subscriber.next({
              get: (field: string) => {
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
    service = injector.get(LocationService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no location object on error', () => {
    const req = httpMock.expectOne(`${LocationService.BASE_URL}/3`);
    req.error(new ErrorEvent('Network error'));
    
    expect(component.location).toBeFalsy();
  });

  it('should call locationService.deleteLocation() on delete', () => {
    let location = new Location(3, 'name');
    component.location = location;

    spyOn(service, 'deleteLocation');
    component.deleteLocation();
    expect(service.deleteLocation).toHaveBeenCalled();
  });
});
