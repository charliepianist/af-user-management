import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { TestingModule } from '../test/TestingModule';
import { CustomerListComponent } from '../routes/customers/customer-list/customer-list.component';
import { Page } from '../model/page';
import { Customer } from '../model/customer';
import { Pageable } from '../model/pageable';

describe('PaginatorComponent with customer page', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginatorComponent ],
      imports: [ TestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const customerPage = new Page<Customer>();
    // 10 filler customers
    customerPage.content = [new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer(), new Customer()];
    customerPage.pageable = new Pageable();
    customerPage.numberOfElements = 10;
    customerPage.totalElements = 25;
    customerPage.pageable.offset = 10;
    customerPage.number = 1; // Spring page index starts at 0
    customerPage.totalPages = 3;
    customerPage.last = false;
    customerPage.first = false;

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.page = customerPage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct instance variables given an input page', () => {
    // Elements 11 to 20 of 25, page 2 of 3
    expect(component.startElement).toBe(11);
    expect(component.endElement).toBe(20);
    expect(component.totalElements).toBe(25);
    expect(component.pageNumber).toBe(2); // paginator pageNumber is indexed at 1
    expect(component.totalPages).toBe(3);
    expect(component.first).toBe(false);
    expect(component.last).toBe(false);
    expect(component.pageToGoTo).toBe(2);
  });
});
