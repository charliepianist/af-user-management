import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEntitlementsComponent } from './customer-entitlements.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { Product } from 'src/app/model/product';
import { Location } from 'src/app/model/location';
import { Entitlement } from 'src/app/model/entitlement';
import { DateUtil } from 'src/app/helper/date-util';


describe('CustomerEntitlementsComponent', () => {
  let component: CustomerEntitlementsComponent;
  let fixture: ComponentFixture<CustomerEntitlementsComponent>;
  let prods: Product[];
  let locs: Location[];
  let date: Date

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEntitlementsComponent ],
      imports: [ TestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEntitlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //Setup
    prods = [
      new Product(1, "Product 1"),
      new Product(2, "Product 2"),
      new Product(3, "Product 3")
    ];
    component.products = prods;
    locs = [
      new Location(1000, "LOC1", "Location 1"),
      new Location(2000, "LOC2", "Location 2"),
      new Location(3000, "LOC3", "Location 3"),
      new Location(4000, "LOC4", "Location 4")
    ];
    component.locations = locs;

    date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    component.entitlements = [
      new Entitlement(10000, prods[1], locs[0], null, null),
      new Entitlement(20000, prods[1], locs[1], null, null),
      new Entitlement(30000, prods[2], locs[2], null, date),
      new Entitlement(40000, prods[2], locs[3], null, date)
    ];


    component.processEntitlements();
    
    /* 
              Locations
    Products  [null, null, null, null]
              [____, ____, null, null],
              [null, null, ____, ____]
              
    */

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly process Unsubbed -> Subbed', () => {
    component.subscribe(0, 0);
    expect(component.isSubscribed(0, 0)).toBeTruthy();
    expect(component.expirationDate(0, 0)).toBeFalsy();
    expect(component.notSubscribed(0, 0)).toBeFalsy();
  });

  it('should properly process Unsubbed -> Trial', () => {
    component.addTrialPrompt(0, 0);
    component.addTrials();
    expect(component.isSubscribed(0, 0)).toBeFalsy();
    expect(component.expirationDate(0, 0)).toBeTruthy();
    expect(component.notSubscribed(0, 0)).toBeFalsy();
  });

  it('should properly process Subbed -> Unsubbed', () => {
    component.unsubscribe(1, 0);
    expect(component.isSubscribed(1, 0)).toBeFalsy();
    expect(component.expirationDate(1, 0)).toBeFalsy();
    expect(component.notSubscribed(1, 0)).toBeTruthy();
  });

  it('should properly process Subbed -> Trial', () => {
    component.unsubscribe(1, 0);
    component.addTrialPrompt(1, 0);
    component.addTrials();
    expect(component.isSubscribed(1, 0)).toBeFalsy();
    expect(component.expirationDate(1, 0)).toBeTruthy();
    expect(component.notSubscribed(1, 0)).toBeFalsy();
  });

  it('should properly process Trial -> Subbed', () => {
    component.subscribe(2, 3);
    expect(component.isSubscribed(2, 3)).toBeTruthy();
    expect(component.expirationDate(2, 3)).toBeFalsy();
    expect(component.notSubscribed(2, 3)).toBeFalsy();
  });

  it('should properly process Trial -> Unsubbed', () => {
    component.unsubscribe(2, 3);
    expect(component.isSubscribed(2, 3)).toBeFalsy();
    expect(component.expirationDate(2, 3)).toBeFalsy();
    expect(component.notSubscribed(2, 3)).toBeTruthy();
  });

  it('should not allow an invalid trial time (initially unsubbed)', () => {
    // Invalid format
    let index = component.addTrialPrompt(0, 0);
    component.endTime = "34rfouh";
    component.addTrials();
    expect(component.isSubscribed(0, 0)).toBeFalsy();
    expect(component.expirationDate(0, 0)).toBeFalsy();
    expect(component.notSubscribed(0, 0)).toBeTruthy();

    //Before current time
    component.removeTrialPrompt(index);
    component.addTrialPrompt(0, 0);
    component.endTime = "1961-08-08T00:00";
    component.addTrials();
    expect(component.isSubscribed(0, 0)).toBeFalsy();
    expect(component.expirationDate(0, 0)).toBeFalsy();
    expect(component.notSubscribed(0, 0)).toBeTruthy();
  })

  it('should not allow an invalid trial time (initially subbed)', () => {
    // Invalid format
    let index = component.addTrialPrompt(1, 0);
    component.endTime = "34rfouh";
    component.addTrials();
    expect(component.isSubscribed(1, 0)).toBeTruthy();
    expect(component.expirationDate(1, 0)).toBeFalsy();
    expect(component.notSubscribed(1, 0)).toBeFalsy();

    //Before current time
    component.removeTrialPrompt(index);
    component.addTrialPrompt(1, 0);
    component.endTime = "1961-08-08T00:00";
    component.addTrials();
    expect(component.isSubscribed(1, 0)).toBeTruthy();
    expect(component.expirationDate(1, 0)).toBeFalsy();
    expect(component.notSubscribed(1, 0)).toBeFalsy();
  })

  it('should give correct entitlements with getEntitlements() and not include trial prompts', () => {
    // Removing Old Entitlements
    component.unsubscribe(1, 1);
    component.unsubscribe(2, 3);

    // New Entitlements
    component.addTrialPrompt(2, 1);
    component.endTime = DateUtil.dateToInputString(date);
    console.log(date);
    component.addTrials();
    component.subscribe(0, 0);
    component.addTrialPrompt(2, 3); // should NOT be in getEntitlements()

    let sorter = (a: Entitlement, b: Entitlement) => {
      if(a.getId() === null && b.getId() === null) 
      return a.getProduct().getName() > b.getProduct().getName() ? 1 : -1;
      else return a.getId() - b.getId();
    }

    let entitlements = [
      new Entitlement(10000, prods[1], locs[0], null, null),
      new Entitlement(30000, prods[2], locs[2], null, date),
      new Entitlement(null, prods[0], locs[0], null, null),
      new Entitlement(null, prods[2], locs[1], null, date)
    ].sort(sorter);
    let sortedCompEntitlements = component.getEntitlements().sort(sorter);
    
    // should not have any extra entitlements and should have the same entitlements
    expect(entitlements.length).toBe(sortedCompEntitlements.length);
    for(let i = 0; i < entitlements.length; i++) {
      expect(entitlements[i].equals(sortedCompEntitlements[i])).toBeTruthy();
    }
  });

  it('should record changes', () => {
    component.subscribe(0, 0);
    component.addTrialPrompt(2, 0);
    component.addTrials();
    
    expect(component.changes.length).toBe(2);
    if(component.changes[0].getProductIndex() === 2) {
      let temp = component.changes[0];
      component.changes[0] = component.changes[1];
      component.changes[1] = temp;
    }
    console.log(component.changes);
    expect(component.changes[0].getProductIndex()).toBe(0);
    expect(component.changes[0].getLocationIndex()).toBe(0);
    
    expect(component.changes[1].getProductIndex()).toBe(2);
    expect(component.changes[1].getLocationIndex()).toBe(0);
  });

  it('should not record a change-undo combination as change', () => {
    // manual change
    component.subscribe(0, 0); // Subscribe, then unsubscribe
    component.addTrialPrompt(2, 0);
    component.addTrials();
    component.unsubscribe(0, 0);
    expect(component.changes.length).toBe(1);

    // Undo button
    component.subscribe(2, 3); // Subscribe, then undo
    component.undoChange(component.changes.map(c => c.getLocationIndex()).indexOf(3));
    expect(component.changes.length).toBe(1);
  })
});
