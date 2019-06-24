import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonListComponent } from './person-list.component';
import { Page } from 'src/app/model/page';
import { PersonService } from 'src/app/services/person.service';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('people.length should be 0 if page returns no people', () => {
    let service = new PersonService(null);
    let emptyPage = new Page();
    emptyPage.content = [];
    spyOn(service, 'listPeople').and.returnValue(emptyPage);

    let comp = new PersonListComponent(service, null, null);
    expect(comp.people.length).toBe(0);
  });
});
