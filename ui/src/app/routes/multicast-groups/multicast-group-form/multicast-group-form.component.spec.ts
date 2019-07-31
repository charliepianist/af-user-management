import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticastGroupFormComponent } from './multicast-group-form.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { FormsModule } from '@angular/forms';
import { HttpTestingController } from '@angular/common/http/testing';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

describe('Creating new MulticastGroup', () => {
  let component: MulticastGroupFormComponent;
  let fixture: ComponentFixture<MulticastGroupFormComponent>;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MulticastGroupFormComponent],
      imports: [
        TestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(MulticastGroupService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupFormComponent);
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
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate code, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue('error');
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate IP, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue('error');
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateIp).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate port, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePort).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should call multicastGroupService.createMulticastGroup() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    spyOn(service, 'createMulticastGroup');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.validateIp).toHaveBeenCalled();
    expect(component.validatePort).toHaveBeenCalled();
    expect(service.createMulticastGroup).toHaveBeenCalled();
  })
});

describe('Updating MulticastGroup', () => {
  let component: MulticastGroupFormComponent;
  let fixture: ComponentFixture<MulticastGroupFormComponent>;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MulticastGroupFormComponent ],
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
    service = TestBed.get(MulticastGroupService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupFormComponent);
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
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate code, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue('error');
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate IP, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue('error');
    spyOn(component, 'validatePort').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateIp).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should validate port, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePort).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${MulticastGroupService.BASE_URL}`);
  })

  it('should call multicastGroupService.updateMulticastGroup() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateCode').and.returnValue(null);
    spyOn(component, 'validateIp').and.returnValue(null);
    spyOn(component, 'validatePort').and.returnValue(null);
    spyOn(service, 'updateMulticastGroup');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateCode).toHaveBeenCalled();
    expect(component.validateIp).toHaveBeenCalled();
    expect(component.validatePort).toHaveBeenCalled();
    expect(service.updateMulticastGroup).toHaveBeenCalled();
  })
});
