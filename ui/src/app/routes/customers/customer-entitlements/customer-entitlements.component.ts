import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Entitlement } from 'src/app/model/entitlement';
import { Location } from 'src/app/model/location';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { LocationService } from 'src/app/services/location.service';
import { EChange } from 'src/app/helper/entitlement-change';
import { isNullOrUndefined } from 'util';
import { DateUtil } from 'src/app/helper/date-util';

@Component({
  selector: 'app-customer-entitlements',
  templateUrl: './customer-entitlements.component.html',
  styleUrls: ['./customer-entitlements.component.css']
})

export class CustomerEntitlementsComponent implements OnInit {

  @Input() update: boolean = false;
  @Input() entitlements: Entitlement[];
  entitlementGrid: Entitlement[][]; // entitlementGrid[prodIndex][locIndex]
  products: Product[];
  locations: Location[];
  processed: boolean = false; // Has entitlementGrid been processed yet?

  origEntitlements: Entitlement[][];
  changes: EChange[] = [];

  trialPrompts: Entitlement[] = []; // Trials to add, but need time input
  orderedIndices: number[] = []; // Indices of entitlements in trialPrompts in order 
  toSetTime: boolean[] = [];
  prodIndices: number[] = [];
  locIndices: number[] = [];
  trialPromptIndex: number[][];
  selectedTrialPrompt: boolean[][]; // Whether checkbox is checked
  allChecked: boolean = true;
  endTime: string;
  invalidTrialTimeError: string;
  hoverP: number; // when user hovers over a trial prompt,
  hoverL: number; // these highlight the corresponding table cell

  constructor(private productService: ProductService,
    private locationService: LocationService) {}

  ngOnInit() {
    let tom = new Date();
    tom.setHours(0, 0, 0, 0);
    tom.setDate(tom.getDate() + 1);
    this.endTime = DateUtil.dateToInputString(tom);
    
    // Load products and locations
    this.productService.listProducts(
      p => {
        this.products = p.content;
        this.processEntitlements();
      },
      e => {
        alert('Could not load products, see console for details.');
        console.log(e);
      },
      {sortBy: "name", size: 500}
    )
    this.locationService.listLocations(
      p => {
        this.locations = p.content;
        this.processEntitlements();
      },
      e => {
        alert('Could not load locations, see console for details.');
        console.log(e);
      },
      {sortBy: "code", size: 500}
    )
  }

  getProductIndexByName(name: string) {
    return this.products.map(
      p => p.getName()
    ).indexOf(name);
  }

  getLocationIndexByCode(code: string) {
    return this.locations.map(
      l => l.getCode()
    ).indexOf(code);
  }

  // Customer's trial's expiration date, or null otherwise
  expirationDate(pIndex: number, lIndex: number): string {
    if(this.processed) {
      let entitlement = this.entitlementGrid[pIndex][lIndex];
      if(entitlement && entitlement.getExpirationDate())
        return entitlement.getExpirationDate().toLocaleString(
          'en-US', {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit'
          });
      else return null;
    }else return null;
  }

  // Customer is currently subscribed and not on trial for prod/loc combo
  isSubscribed(pIndex: number, lIndex: number): boolean {
    if(this.processed) {
      let entitlement = this.entitlementGrid[pIndex][lIndex];
      if(entitlement)
        return entitlement.getExpirationDate() === null;
      else return false;
    }else return false;
  }

  // is not subscribed, according to entitlement grid, but can display differently
  notSubscribed(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return true;
    return this.entitlementGrid[pIndex][lIndex] === null
  }

  // should display as not subscribed
  displayNotSubscribed(pIndex: number, lIndex: number): boolean {
    return !this.expirationDate(pIndex, lIndex) && 
          !this.isSubscribed(pIndex, lIndex) && 
          !this.hasTrialPrompt(pIndex, lIndex)
  }

  getEntitlements(): Entitlement[] {
    let newEntitlements = [];
    for(let arr of this.entitlementGrid) {
      for(let entitlement of arr) {
        if(entitlement) newEntitlements.push(entitlement);
      }
    }
    return newEntitlements;
  }

  useEntitlements(entitlements: Entitlement[]) {
    this.entitlements = entitlements;
    this.processEntitlements();
  }

  processEntitlements(): boolean {
    if(this.processed) return true;
    if(this.products && this.locations && this.entitlements) {
      this.entitlementGrid = [];
      this.origEntitlements = [];
      this.trialPromptIndex = [];
      this.selectedTrialPrompt = [];
      for(let i = 0; i < this.products.length; i++) {
        this.entitlementGrid[i] = [];
        this.origEntitlements[i] = [];
        this.trialPromptIndex[i] = [];
        this.selectedTrialPrompt[i] = [];
        for(let j = 0; j < this.locations.length; j++) {
          this.entitlementGrid[i][j] = null;
          this.origEntitlements[i][j] = null;
          this.trialPromptIndex[i][j] = null;
          this.selectedTrialPrompt[i][j] = false;
        }
      }
      for(let entitlement of this.entitlements) {
        let pIndex = 
          this.getProductIndexByName(entitlement.getProduct().getName());
        let lIndex = 
          this.getLocationIndexByCode(entitlement.getLocation().getCode());
        this.entitlementGrid[pIndex][lIndex] = entitlement;
        this.origEntitlements[pIndex][lIndex] = entitlement;
      }
      this.processed = true;
      return true;
    }
    return false;
  }

  cellClasses(i: number, j: number) {
    if(!this.processed) return {};
    if(this.update) {
      return {
        'subscribed': this.isSubscribed(i, j),
        'trial': this.expirationDate(i, j) ? true : false,
        'not-subscribed': this.displayNotSubscribed(i, j),
        'has-trial-prompt': this.hasTrialPrompt(i, j),
        'selected-trial-prompt': this.hasSelectedTrialPrompt(i, j),
        'hover-highlight': i === this.hoverP && j === this.hoverL,
        'changed': this.hasChanged(i, j),
      };
    }else return {
      'view-subscribed': this.isSubscribed(i, j),
      'view-trial': this.expirationDate(i, j) ? true : false,
      'view-not-subscribed': this.displayNotSubscribed(i, j)
    }
  }

  unsubscribe(pIndex: number, lIndex: number) {
    this.setEntitlement(pIndex, lIndex, null);
  }
  subscribe(pIndex: number, lIndex: number) {
    if(this.processed) {
      let entitlement = new Entitlement(null, this.products[pIndex],
        this.locations[lIndex]);
      this.setEntitlement(pIndex, lIndex, entitlement);
    }
  }
  

  cellClick(pIndex: number, lIndex: number) {
    if(this.processed) {
      if(!this.hasTrialPrompt(pIndex, lIndex)) {
        if(this.isSubscribed(pIndex, lIndex)) {
          // currently subscribed, want to unsubscribe
          this.unsubscribe(pIndex, lIndex);
    
        }else if(this.expirationDate(pIndex, lIndex)) {
          // on trial, want to subscribe
          this.subscribe(pIndex, lIndex);
        }else {
          // not subscribed, want to subscribe
          this.subscribe(pIndex, lIndex);
        }
      }else {
        // has trial prompt, want to remove
        let i = this.trialPromptIndex[pIndex][lIndex];
        this.removeTrialPrompt(i);
      }
    }
  }

  lowerHalfClick(pIndex: number, lIndex: number) {
    if(this.processed) {
      if(this.expirationDate(pIndex, lIndex)) {
        // on trial, want to unsubscribe
        this.unsubscribe(pIndex, lIndex)
      }else {
        // not subscribed, want to add trial
        if(!this.hasTrialPrompt(pIndex, lIndex)) {
          this.addTrialPrompt(pIndex, lIndex);
        }else {
          // has trial prompt, want to remove
          let i = this.trialPromptIndex[pIndex][lIndex];
          this.removeTrialPrompt(i);
        }
      }
    }
  }

  setEntitlement(pIndex: number, lIndex: number, entitlement: Entitlement) {
    this.entitlementGrid[pIndex][lIndex] = entitlement;
    let origEntitlement = this.origEntitlements[pIndex][lIndex];
    let updateChange: Boolean; // need to update changes array

    if(isNullOrUndefined(entitlement)) updateChange = !isNullOrUndefined(origEntitlement);
    else { 
      updateChange = !entitlement.equals(origEntitlement);
    }
    for(let i = 0; i < this.changes.length; i++) {
      if(this.changes[i].getProductIndex() === pIndex && 
        this.changes[i].getLocationIndex() === lIndex) {
        if(updateChange) {
          // push updated change to most recent
          this.changes.push(EChange.copy(
            this.changes[i], {newEntitlement: entitlement}
          ));
        }
        this.changes.splice(i, 1);
        updateChange = false;
        break;
      }
    }
    if(updateChange) {
      this.changes.push(new EChange(
        entitlement, origEntitlement, pIndex, lIndex
      ));
    }
    this.changes.sort((a: EChange, b: EChange) => {
      if(a.getProduct().getName() === b.getProduct().getName()) {
        return a.getLocation().getCode() > b.getLocation().getCode() ? 1 : -1;
      }else return a.getProduct().getName() > b.getProduct().getName() ? 1 : -1;
    })
  }

  hasTrialPrompt(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return this.trialPromptIndex[pIndex][lIndex] != null;
  }

  hasSelectedTrialPrompt(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return this.selectedTrialPrompt[pIndex][lIndex];
  }

  hasChanged(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return !Entitlement.areEqual(this.origEntitlements[pIndex][lIndex],
      this.entitlementGrid[pIndex][lIndex])
  }

  sortOrderedIndices() {
    this.orderedIndices = [];
    let dummyArr = this.trialPrompts.map(
      (e, i) => { 
        return { 
          prod: e.getProduct().getName(),
          loc: e.getLocation().getCode(),
          index: i
        }
      }
    );
    dummyArr.sort((a, b) => {
      if(a.prod === b.prod) {
        return a.loc > b.loc ? 1 : -1;
      }else return a.prod > b.prod ? 1 : -1;
    })
    
    for(let i = 0; i < dummyArr.length; i++) {
      this.orderedIndices[i] = dummyArr[i].index;
    }
  }

  addTrialPrompt(pIndex: number, lIndex: number): number {
    this.trialPrompts.push(new Entitlement(
      null, this.products[pIndex], this.locations[lIndex], null, null));
    this.trialPromptIndex[pIndex][lIndex] = this.toSetTime.length;
    this.selectedTrialPrompt[pIndex][lIndex] = true;
    this.toSetTime.push(true);
    this.prodIndices.push(pIndex);
    this.locIndices.push(lIndex);

    this.sortOrderedIndices();

    return this.toSetTime.length - 1; // Index of new value
  }

  removeTrialPrompt(i: number) {
    let p = this.prodIndices[i];
    let l = this.locIndices[i];
    this.prodIndices.splice(i, 1);
    this.locIndices.splice(i, 1);
    this.toSetTime.splice(i, 1);
    this.trialPrompts.splice(i, 1);
    this.selectedTrialPrompt[p][l] = false;
    let prevPromptIndex = this.trialPromptIndex[p][l]
    for(let arr of this.trialPromptIndex) {
      for(let index = 0; index < arr.length; index++) {
        if(arr[index] > prevPromptIndex) {
          arr[index]--;
        }
      }
    }
    this.trialPromptIndex[p][l] = null;

    this.sortOrderedIndices();
  }

  toggleTrialPrompts() {
    this.allChecked = !this.allChecked;
    for(let i = 0; i < this.toSetTime.length; i++) {
      this.toSetTime[i] = this.allChecked;
      this.selectedTrialPrompt[this.prodIndices[i]][this.locIndices[i]] = this.allChecked;
    }
  }

  toggleTrialPrompt(i: number) {
    this.toSetTime[i] = !this.toSetTime[i];
    this.selectedTrialPrompt[this.prodIndices[i]][this.locIndices[i]] = this.toSetTime[i];
    if(!this.toSetTime[i]) this.allChecked = false;
  }

  trialPromptMouseover(i: number) {
    this.hoverP = this.prodIndices[i];
    this.hoverL = this.locIndices[i];
  }

  trialPromptMouseleave(i: number) {
    this.resetHover();
  }

  resetHover() {
    this.hoverL = null;
    this.hoverP = null;
  }

  addTrials() {
    this.invalidTrialTimeError = null;
    let endDate = new Date(Date.parse(this.endTime));
    if(endDate.getTime() < new Date().getTime()) {
      this.invalidTrialTimeError = 'Cannot create trials that already ended.'
    }else if(isNaN(endDate.getTime())) {
      this.invalidTrialTimeError = 'Invalid Time Format.'
    }else {
      let toDelete = [];
      for(let i = 0; i < this.trialPrompts.length; i++) {
        if(this.toSetTime[i]) {
          let entitlement = this.trialPrompts[i];
          let pIndex = this.prodIndices[i];
          let lIndex = this.locIndices[i];
          this.setEntitlement(pIndex, lIndex, Entitlement.copy(
            entitlement,
            {expirationDate: endDate}
          ));
          
          toDelete.push(i);
        }
      }
      // cleanup
      for(let i = toDelete.length - 1; i >= 0; i--) {
        this.removeTrialPrompt(toDelete[i]);
      }
    }
  }

  undoChange(changeIndex: number) {
    let change = this.changes[changeIndex];
    let trialIndex = this.trialPromptIndex[change.getProductIndex()][change.getLocationIndex()];
    if(trialIndex !== null) {
      this.removeTrialPrompt(trialIndex);
    }

    this.resetHover();
    this.entitlementGrid[change.getProductIndex()]
    [change.getLocationIndex()] = change.getOldEntitlement();

    this.changes.splice(changeIndex, 1);
  }

  changeMouseover(i: number) {
    let change = this.changes[i];
    this.hoverP = change.getProductIndex();
    this.hoverL = change.getLocationIndex();
  }

  changeMouseleave(i: number) {
    let change = this.changes[i];
    this.resetHover();
  }

  isFirstChange(i: number) {
    return i === 0 || this.changes[i].getProduct().getName() !== 
                      this.changes[i - 1].getProduct().getName();
  }

  numChangesByProduct(i: number) {
    let name = this.changes[i].getProduct().getName();
    let prodNames = this.changes.map(
      c => c.getProduct().getName()
    );
    return prodNames.lastIndexOf(name) - prodNames.indexOf(name) + 1;
  }
}
