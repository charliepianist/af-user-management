import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/model/customer';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerEntitlementsComponent } from '../customer-entitlements/customer-entitlements.component';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  @ViewChild(CustomerEntitlementsComponent) 
  customerEntitlementsComponent: CustomerEntitlementsComponent;
  id: string; // null if invalid ID or no ID passed in
  idNum: number = null; 
  errorMsg: string = null;
  customer: Customer = new Customer();
  origName: string = null;
  name: string = null;
  userId: string = null;
  password: string = null;
  disabled: boolean = false;
  passLength: number = 15;
  invalidSubmit: boolean = false; // when submit clicked with invalid input
  submissionErrorMsg: string = null;

  constructor(private router: Router, private route: ActivatedRoute, private customerService: CustomerService) {}

  ngOnInit() {
    let errorFunc = (e: HttpErrorResponse) => {
      this.errorMsg = e.message; 
      console.log(e);
    };
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if(this.isUpdating()) this.customerService.getCustomerWithEntitlements(this.id, 
          p => {
            this.customer = p
            this.origName = this.customer.getName();
            this.idNum = this.customer.getId();
            this.name = this.origName;
            this.userId = this.customer.getUserId();
            this.password = this.customer.getPassword();
            this.disabled = this.customer.isDisabled();
            this.customerEntitlementsComponent.useEntitlements(
              this.customer.getEntitlements());
          },
          e => { 
            this.id = null; 
            errorFunc(e);
          });
      },
      errorFunc);
  }

  validateName(): string {
    if(!this.name) return 'Please enter a name.';
    if(this.name.length > 100) return 'Name is too long (100 characters max).';
    return null;
  }
  validateUserId(): string {
    if(!this.userId) return 'Please enter a User ID.';
    if(this.userId.length > 20) return 'User ID is too long (20 characters max).';
    return null;
  }
  validatePassword(): string {
    if(!this.password) return 'Please enter a Password.';
    if(!this.password.match('[a-z]')) return 'Password must contain a lowercase letter.';
    if(!this.password.match('[A-Z]')) return 'Password must contain an uppercase letter.';
    if(!this.password.match('[0-9]')) return 'Password must contain a number.';
    if(!this.password.match(`[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?]`)) return "Password must contain a special character.";
    if(this.password.length < 15) return 'Password must have at least 15 characters.'
    if(this.password.length > 100) return 'Password must have at most 100 characters.'
    return null;
  }

  isUpdating(): boolean {
    if(this.id) return true;
    return false;
  }
  
  submitButton() {
    if(this.validateName() || this.validateUserId() || this.validatePassword()) {
      this.invalidSubmit = true;
    }else {
      let newCustomer = new Customer(
        this.idNum, 
        this.name, 
        this.userId, 
        this.password, 
        this.customerEntitlementsComponent.getEntitlements(),
        this.disabled);

      let successFunc = (p: Customer) => {
        this.router.navigate(['/customers', p.getId()]);
      };
      let errorFunc = (e: HttpErrorResponse) => {
        this.submissionErrorMsg = e.error.status + ' ' + 
                                  e.error.error + ': ' +
                                  e.error.message;
        console.log(e);
      }
      if(this.customerEntitlementsComponent.haveEntitlementsChanged()) {
        if(this.isUpdating()) {
          // Updating an already existing user
          this.customerService.updateCustomerWithEntitlements(newCustomer, successFunc, 
            errorFunc);
        }else {
          // Creating a new user
          this.customerService.createCustomerWithEntitlements(newCustomer, successFunc,
            errorFunc);
        }
      }else {
        if(this.isUpdating()) {
          // Updating an already existing user without entitlements
          this.customerService.updateCustomer(newCustomer, successFunc, 
            errorFunc);
        }else {
          // Creating a new user without entitlements
          this.customerService.createCustomer(newCustomer, successFunc,
            errorFunc);
        }
      }
    }
  }

  cancelButton() {
    if(this.isUpdating()) {
      this.router.navigate(['/customers', this.customer.getId()]);
    }else this.router.navigate(['/customers']);
  }

  generatePassword() {
    this.passLength = Math.max(Math.min(Math.floor(this.passLength), 100), 15);
    let categories = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                      'abcdefghijklmnopqrstuvwxyz',
                      '0123456789',
                      '[!@#$%^&*()_+-=[]{};\':"\\|,.<>/?]'];
    let chars = categories[0] + categories[1] + categories[2] + categories[3];

    let result = '';
    for(let i = 0; i < this.passLength - categories.length; i++) {
      result += chars.charAt(Math.floor(Math.random() * (chars.length)));
    }
    for(let i = 0; i < categories.length; i++) {
      let pos = Math.floor(Math.random() * (result.length + 1));
      let char = categories[i].charAt(Math.floor(Math.random() * categories[i].length));
      result = result.substring(0, pos) + char + result.substring(pos);
    }
    this.password = result;
  }
}
