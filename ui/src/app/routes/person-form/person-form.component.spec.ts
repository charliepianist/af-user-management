import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFormComponent } from './person-form.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { FormsModule } from '@angular/forms';
import { HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from 'src/app/services/person.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';



describe('Creating new Person', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonFormComponent ],
      imports: [
        TestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(PersonService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonFormComponent);
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
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue('error');
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should call personService.createPerson() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    spyOn(service, 'createPerson');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(service.createPerson).toHaveBeenCalled();
  })
});

describe('Updating Person', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonFormComponent ],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable(subscriber => {
            subscriber.next({
              get: () => {
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
    service = TestBed.get(PersonService);
    httpMock = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(PersonFormComponent);
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
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateName).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should validate userId, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue('error');
    spyOn(component, 'validatePassword').and.returnValue(null);
    component.submitButton();
    
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should validate password, no creation if invalid', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue('error');
    component.submitButton();
    
    expect(component.validatePassword).toHaveBeenCalled();
    expect(component.invalidSubmit).toBeTruthy();
    httpMock.expectNone(`${PersonService.BASE_URL}`);
  })

  it('should call personService.updatePerson() for valid inputs', () => {
    spyOn(component, 'validateName').and.returnValue(null);
    spyOn(component, 'validateUserId').and.returnValue(null);
    spyOn(component, 'validatePassword').and.returnValue(null);
    spyOn(service, 'updatePerson');
    component.submitButton();

    expect(component.validateName).toHaveBeenCalled();
    expect(component.validateUserId).toHaveBeenCalled();
    expect(component.validatePassword).toHaveBeenCalled();
    expect(service.updatePerson).toHaveBeenCalled();
  })
});
