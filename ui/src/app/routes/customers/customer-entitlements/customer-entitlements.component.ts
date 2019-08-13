import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Entitlement } from 'src/app/model/entitlement';
import { Location } from 'src/app/model/location';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { LocationService } from 'src/app/services/location.service';
import { EntitlementChange } from 'src/app/routes/customers/customer-entitlements/entitlement-change';
import { DateUtil } from 'src/app/helper/date-util';
import { EntitlementEntry } from './entitlement-entry';
import { TrialPrompt } from './trial-prompt';
import { Enum } from 'src/app/helper/enum';

@Component({
  selector: 'app-customer-entitlements',
  templateUrl: './customer-entitlements.component.html',
  styleUrls: ['./customer-entitlements.component.css']
})

export class CustomerEntitlementsComponent implements OnInit {

  @Input() update: boolean = false;
  @Input() enabled: boolean = true;
  @Input() entitlements: Entitlement[];
  // Null -> no entitlement, entitlement without date -> subscribed, with date -> trial
  entitlementGrid: EntitlementEntry[][]; // entitlementGrid[prodIndex][locIndex]
  products: Product[];
  locations: Location[];
  processed: boolean = false; // Has entitlementGrid been processed yet?

  changes: EntitlementChange[] = [];

  trialPrompts: TrialPrompt[] = []; // Trials to add, but need time input
  allChecked: boolean = true;
  endTime: string;
  invalidTrialTimeError: string;
  hoverP: number; // when user hovers over a trial prompt,
  hoverL: number; // these highlight the corresponding table cell

  showNumLogins: boolean = false;

  tooltips = Enum.TOOLTIP.CUSTOMER;
  text = Enum.DISPLAY_TEXT.CUSTOMER;

  readonly legendStyles = [
    {
      'meaning': 'Unsubscribed',
      'styles': {
        'background-color': 'inherit'
      }
    },
    {
      'meaning': `Unsubscribed`,
      'subtitle': 'updated',
      'styles': {
        'background': `repeating-linear-gradient(
          45deg, 
          rgba(255, 0, 0, 0.226),
          rgba(255, 0, 0, 0.226) 5px,
          rgba(194, 0, 0, 0.322) 5px,
          rgba(194, 0, 0, 0.322) 10px
      )`
      },
      'updateOnly': true
    },
    {
      'meaning': 'Subscribed',
      'styles': {
        'background-color': 'rgba(90, 212, 33, 0.932)'
      }
    },
    {
      'meaning': `Subscribed`,
      'subtitle': 'updated',
      'styles': {
        'background': `repeating-linear-gradient(
          45deg,
          rgba(36, 196, 4, 0.89),
          rgba(36, 196, 4, 0.89) 5px,
          rgba(90, 212, 33, 0.932) 5px,
          rgba(90, 212, 33, 0.932) 10px
      )`
      },
      'updateOnly': true
    },
    {
      'meaning': 'Trial',
      'styles': {
        'background-color': 'rgba(93, 220, 236, 0.877)'
      }
    },
    {
      'meaning': `Trial`,
      'subtitle': 'updated',
      'styles': {
        'background': `repeating-linear-gradient(
          45deg,
          rgba(139, 232, 255, 0.904),
          rgba(139, 232, 255, 0.904) 5px,
          rgba(93, 220, 236, 0.877) 5px,
          rgba(93, 220, 236, 0.877) 10px
      )`
      },
      'styleText': `Trial
      4/5/22`,
      'updateOnly': true
    },
    {
      'meaning': `Trial Prompt`,
      'subtitle': 'unselected',
      'styles': {
        'background': `repeating-linear-gradient(
          45deg,
          rgba(139, 232, 255, 0.904),
          rgba(139, 232, 255, 0.904) 5px,
          rgba(93, 220, 236, 0.877) 5px,
          rgba(93, 220, 236, 0.877) 10px
      )`
      },
      'updateOnly': true
    },
    {
      'meaning': `Trial Prompt`,
      'subtitle': 'selected',
      'classes': {
        'selected-trial-prompt-animation': true
      },
      'updateOnly': true
    },
  ];

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
      let entitlement = this.getEntitlement(pIndex, lIndex);
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

  // Customer's previous trial expiration date (may or may not have changed)
  viewExpirationDate(pIndex: number, lIndex: number): string {
    if(this.processed) {
      let entitlement = this.getOriginalEntitlement(pIndex, lIndex);
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

  viewNumLogins(pIndex: number, lIndex: number): number {
    let entitlement = this.getOriginalEntitlement(pIndex, lIndex);
    if(entitlement)
      return entitlement.getNumLogins();
    return null;
  }

  // Customer is currently subscribed
  isSubscribed(pIndex: number, lIndex: number): boolean {
    if(this.processed) {
      let entitlement = this.getEntitlement(pIndex, lIndex);
      if(entitlement)
        return entitlement.getExpirationDate() === null;
      else return false;
    }else return false;
  }

  // Customer was subscribed (may or may not have changed)
  viewSubscribed(pIndex: number, lIndex: number): boolean {
    if(this.processed) {
      let entitlement = this.getOriginalEntitlement(pIndex, lIndex);
      if(entitlement) {
        return entitlement.getExpirationDate() === null;
      }else return false;
    }else return false;
  }

  // is not subscribed, according to entitlement grid, but can display differently
  notSubscribed(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return true;
    return this.getEntitlement(pIndex, lIndex) === null;
  }

  // should display as not subscribed
  displayNotSubscribed(pIndex: number, lIndex: number): boolean {
    return !this.expirationDate(pIndex, lIndex) && 
          !this.isSubscribed(pIndex, lIndex) && 
          !this.hasTrialPrompt(pIndex, lIndex)
  }

  // Customer was not subscribed (may or may not have changed)
  viewNotSubscribed(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return true;
    return this.getOriginalEntitlement(pIndex, lIndex) === null;
  }

  getEntitlementCell(prodIndex: number, locIndex: number): EntitlementEntry {
    return this.entitlementGrid[prodIndex][locIndex];
  }

  setEntitlementCell(prodIndex: number, locIndex: number, cell: EntitlementEntry) {
    this.entitlementGrid[prodIndex][locIndex] = cell;
  }

  getEntitlement(prodIndex: number, locIndex: number): Entitlement {
    return this.getEntitlementCell(prodIndex, locIndex)
      .getCurrentEntitlement();
  }

  getOriginalEntitlement(prodIndex: number, locIndex: number): Entitlement {
    return this.getEntitlementCell(prodIndex, locIndex)
      .getOriginalEntitlement();
  }

  getPromptCell(promptIndex: number): EntitlementEntry {
    return this.getEntitlementCell(
      this.getTrialPrompt(promptIndex).getProductIndex(), 
      this.getTrialPrompt(promptIndex).getLocationIndex()
    );
  }

  getEntitlementGrid(): EntitlementEntry[][] {
    return this.entitlementGrid;
  }

  initEntitlementGrid() {
    if(this.products && this.locations) {
      this.entitlementGrid = [];
      for(let i = 0; i < this.products.length; i++) {
        this.entitlementGrid[i] = [];
        for(let j = 0; j < this.locations.length; j++) {
          this.entitlementGrid[i][j] = new EntitlementEntry(null, null)
        }
      }
    }
  }

  entitlementGridToEntitlements(): Entitlement[][] {
    return this.entitlementGrid.map(
      arr => arr.map(
        entitlementCell => entitlementCell.getCurrentEntitlement()
      )
    );
  }
  
  getEntitlements(): Entitlement[] {
    let newEntitlements = [];
    let entitlementArray = this.entitlementGridToEntitlements();
    for(let arr of entitlementArray) {
      for(let entitlement of arr) {
        if(entitlement) {
          entitlement.validateNumLogins();
          newEntitlements.push(entitlement);
        }
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
      this.initEntitlementGrid();
      for(let entitlement of this.entitlements) {
        let pIndex = 
          this.getProductIndexByName(entitlement.getProduct().getName());
        let lIndex = 
          this.getLocationIndexByCode(entitlement.getLocation().getCode());
        this.setEntitlementCell(pIndex, lIndex, 
          new EntitlementEntry(entitlement, Entitlement.copy(entitlement)));
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
        'update-num-logins': this.showNumLogins,
        'clickable-cell': true
      };
    }else return {
      'view-subscribed': this.viewSubscribed(i, j),
      'view-trial': this.viewExpirationDate(i, j) ? true : false,
      'view-not-subscribed': this.viewNotSubscribed(i, j)
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
        let i = this.getEntitlementCell(pIndex, lIndex).getTrialPromptIndex();
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
          let i = this.getEntitlementCell(pIndex, lIndex).getTrialPromptIndex();
          this.removeTrialPrompt(i);
        }
      }
    }
  }

  setNumLogins(pIndex: number, lIndex: number, numLogins: number) {
    this.getEntitlement(pIndex, lIndex).setNumLogins(numLogins);
    this.detectChanges(pIndex, lIndex);
  }

  setEntitlement(pIndex: number, lIndex: number, entitlement: Entitlement) {
    let prevEntry = this.getEntitlementCell(pIndex, lIndex);
    this.setEntitlementCell(pIndex, lIndex, 
      EntitlementEntry.copy(
        prevEntry, 
        {
          currentEntitlement: entitlement
        }
    ));
    
    this.detectChanges(pIndex, lIndex);
  }

  detectChanges(pIndex: number, lIndex: number) {
    let entitlement = this.getEntitlement(pIndex, lIndex);
    let origEntitlement = this.getOriginalEntitlement(pIndex, lIndex);
    // need to update changes array
    let updateChange = !Entitlement.areEqual(entitlement, origEntitlement);
    for(let i = 0; i < this.changes.length; i++) {
      if(this.changes[i].getProductIndex() === pIndex && 
        this.changes[i].getLocationIndex() === lIndex) {
        if(updateChange) {
          // push updated change
          this.changes.push(EntitlementChange.copy(
            this.changes[i], {newEntitlement: entitlement}
          ));
        }
        this.changes.splice(i, 1); // remove old change
        updateChange = false;
        break;
      }
    }
    if(updateChange) {
      this.changes.push(new EntitlementChange(
        entitlement, origEntitlement, pIndex, lIndex
      ));
    }
    this.changes.sort((a: EntitlementChange, b: EntitlementChange) => {
      if(a.getProduct().getName().toLowerCase() === b.getProduct().getName().toLowerCase()) {
        return a.getLocation().getCode().toLowerCase() > b.getLocation().getCode().toLowerCase() ? 1 : -1;
      }else return a.getProduct().getName().toLowerCase() > b.getProduct().getName().toLowerCase() ? 1 : -1;
    })
  }

  hasTrialPrompt(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return this.getEntitlementCell(pIndex, lIndex).hasTrialPrompt();
  }

  hasSelectedTrialPrompt(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return this.getEntitlementCell(pIndex, lIndex).hasSelectedTrialPrompt();
  }

  hasChanged(pIndex: number, lIndex: number): boolean {
    if(!this.processed) return false;
    return this.getEntitlementCell(pIndex, lIndex).hasChanged();
  }

  getOrderedIndices(): number[] {
    return this.trialPrompts.map(
      prompt => prompt.getOrderedIndex()
    );
  }

  sortOrderedIndices() {
    let dummyArr = this.trialPrompts.map(
      (prompt, i) => {
        let e = prompt.getEntitlement(); 
        return { 
          prod: e.getProduct().getName().toLowerCase(),
          loc: e.getLocation().getCode().toLowerCase(),
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
      this.getTrialPrompt(i).setOrderedIndex(dummyArr[i].index);
    }
  }

  getTrialPrompt(i: number): TrialPrompt {
    return this.trialPrompts[i];
  }

  addTrialPrompt(pIndex: number, lIndex: number): number {
    this.getEntitlementCell(pIndex, lIndex).setTrialPrompt(this.trialPrompts.length);
    
    this.trialPrompts.push(new TrialPrompt(
      new Entitlement(
        null, 
        this.products[pIndex], 
        this.locations[lIndex], 
        null, 
        null),
      pIndex,
      lIndex
    ));
    this.sortOrderedIndices();

    return this.trialPrompts.length - 1; // Index of new value
  }

  trialPromptProductIndex(i: number): number {
    return this.trialPrompts[i].getProductIndex();
  }

  trialPromptLocationIndex(i: number): number {
    return this.trialPrompts[i].getLocationIndex();
  }

  trialPromptIsSelected(i: number): boolean {
    return this.trialPrompts[i].isSelected();
  }

  trialPromptEntitlement(i: number): Entitlement {
    return this.trialPrompts[i].getEntitlement();
  }

  removeTrialPrompt(i: number) {
    let p = this.trialPromptProductIndex(i);
    let l = this.trialPromptLocationIndex(i)
    this.trialPrompts.splice(i, 1);

    let entitlementCell = this.getEntitlementCell(p, l);
    let prevPromptIndex = entitlementCell.getTrialPromptIndex();
    entitlementCell.removeTrialPrompt();
    for(let arr of this.getEntitlementGrid()) {
      for(let index = 0; index < arr.length; index++) {
        if(arr[index].getTrialPromptIndex() > prevPromptIndex) {
          arr[index].decrementTrialPromptIndex();
        }
      }
    }

    this.sortOrderedIndices();
  }

  toggleTrialPrompts() {
    this.allChecked = !this.allChecked;
    for(let i = 0; i < this.trialPrompts.length; i++) {
      this.trialPrompts[i].setSelected(this.allChecked);
      this.getEntitlementCell(
        this.trialPromptProductIndex(i), 
        this.trialPromptLocationIndex(i)).setSelected(this.allChecked);
    }
  }

  toggleTrialPrompt(i: number) {
    this.getTrialPrompt(i).toggleSelected();
    this.getPromptCell(i).setSelected(this.trialPromptIsSelected(i));
    if(!this.trialPromptIsSelected(i)) this.allChecked = false;
  }

  trialPromptMouseover(i: number) {
    this.hoverP = this.trialPromptProductIndex(i);
    this.hoverL = this.trialPromptLocationIndex(i);
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
    if(endDate.getTime() <= new Date().getTime()) {
      this.invalidTrialTimeError = 'Cannot create trials that already ended.'
    }else if(isNaN(endDate.getTime())) {
      this.invalidTrialTimeError = 'Invalid Time Format.'
    }else {
      // Valid Time inputted
      let toDelete = []; // Trial Prompts to Delete
      for(let i = 0; i < this.trialPrompts.length; i++) {
        if(this.trialPromptIsSelected(i)) {
          let entitlement = this.trialPromptEntitlement(i);
          let pIndex = this.trialPromptProductIndex(i);
          let lIndex = this.trialPromptLocationIndex(i);
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
    let pIndex = change.getProductIndex();
    let lIndex = change.getLocationIndex();
    let entitlementCell = this.getEntitlementCell(pIndex, lIndex);

    let trialIndex = entitlementCell.getTrialPromptIndex();
    if(trialIndex !== null) {
      this.removeTrialPrompt(trialIndex);
    }

    this.resetHover();
    entitlementCell.undoChange();

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
