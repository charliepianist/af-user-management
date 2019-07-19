import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFormComponent } from './location-form.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { FormsModule } from '@angular/forms';
import { HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

describe('Creating new Location', () => {
  let component: LocationFormComponent;
  let fixture: ComponentFixture<LocationFormComponent>;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationFormComponent],
      imports: [
        TestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(LocationService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a set ID', () => {
    expect(component.id).toBeFalsy();
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue('error');
    spyOn(component, 'validateCode').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${LocationService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue('error');
    component.submitButton();
    
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${LocationService.BASE_URL}`);
  })

  it('should call locationService.createLocation() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(service, 'createLocation');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateCode).toHaveBeenCalled();
    expect(service.createLocation).toHaveBeenCalled();
  })
});

describe('Updating Location', () => {
  let component: LocationFormComponent;
  let fixture: ComponentFixture<LocationFormComponent>;
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationFormComponent ],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable(subscriber => {
            subscriber.next({
              get: (field: string) => {
                return '1';
              }
            });
          })
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(LocationService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(LocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a set ID', () => {
    expect(component.id).toBe('1');
  })

  it('should validate name, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue('error');
    spyOn(component, 'validateCode').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${LocationService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue('error');
    component.submitButton();
    
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${LocationService.BASE_URL}`);
  })

  it('should call locationService.updateLocation() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(service, 'updateLocation');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateCode).toHaveBeenCalled();
    expect(service.updateLocation).toHaveBeenCalled();
  })
});
