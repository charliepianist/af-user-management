import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Customer } from '../model/customer';
import { Page } from '../model/page';
import { Product } from '../model/product';
import { Location } from '../model/location';
import { Entitlement } from '../model/entitlement';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  static readonly BASE_URL = "/api/customers"

  constructor(private httpClient:HttpClient) { }

  private objectToCustomer(cust: {name: string, userId: string, 
    id: number, password: string, entitlements: Entitlement[]}): Customer {
    
    if(isNullOrUndefined(cust.entitlements)) cust.entitlements = new Array();
    return Object.assign(new Customer(), cust);
  }

  private objectArrToEntitlementArr(entitlements: Entitlement[]): Entitlement[] {
    if(entitlements) {
      entitlements.forEach(e => {
        e.product = Object.assign(new Product(), e.product);
        e.location = Object.assign(new Location(), e.location);
        if(e.expirationDate) 
          e.expirationDate = new Date(e.expirationDate);
      });
      entitlements = entitlements.map(
        e => Object.assign(new Entitlement(), e)
      );
    }else entitlements = new Array();
    return entitlements;
  }

  listCustomers(successFunc: (p: Page<Customer>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Customer>>(CustomerService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          cust => this.objectToCustomer(cust)
        );
        successFunc(page);
      }, errorFunc);
  }

  getCustomer(id: string, successFunc: (p: Customer) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Customer>(CustomerService.BASE_URL + '/' + id).subscribe(
      cust => {
        successFunc(this.objectToCustomer(cust));
      }, errorFunc);
  }

  getCustomerEntitlements(id: string, successFunc: (e: Entitlement[]) => any,
    errorFunc: (e: HttpErrorResponse) => any) {
      this.httpClient.get<Entitlement[]>(CustomerService.BASE_URL + '/' + 
                                        id + '/entitlements').subscribe(
        e => {
          successFunc(this.objectArrToEntitlementArr(e));
        }, errorFunc);
  }

  getCustomerWithEntitlements(id: string, successFunc: (p: Customer) => any,
    customerErrorFunc: (e: HttpErrorResponse) => any = e => {
      alert('Could not load customer, see console for details.');
      console.log(e);
    },
    entitlementsErrorFunc: (e: HttpErrorResponse) => any = e => {
      console.log("Error occured loading customer entitlements.");
      customerErrorFunc(e);
    }) {

    this.getCustomer(id, cust => {
      this.getCustomerEntitlements(id, e => {
        cust.setEntitlements(e);
        successFunc(cust);
      }, entitlementsErrorFunc);
    }, customerErrorFunc);

  }

  deleteCustomer(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {
    this.httpClient.delete(CustomerService.BASE_URL + '/' + id)
    .subscribe(successFunc, errorFunc);
  }

  createCustomer(customer: Customer, successFunc: (c: Customer) => any,
                errorFunc: (e: HttpErrorResponse) => any) {
    // Don't send entitlements
    customer = Customer.copy(customer, {entitlements: null});
    
    this.httpClient.post(CustomerService.BASE_URL, customer)
    .subscribe((c: Customer) => {
      successFunc(this.objectToCustomer(c));
    }, errorFunc);

  }

  createCustomerWithEntitlements(customer: Customer, 
    successFunc: (c: Customer) => any,
    customerErrorFunc: (e: HttpErrorResponse) => any = e => {
      alert('Could not create customer, see console for details.');
      console.log(e);
    },
    entitlementsErrorFunc: (e: HttpErrorResponse) => any = e => {
      console.log("Customer was created, but could not save entitlements.");
      customerErrorFunc(e);
    }) {

    this.createCustomer(customer, cust => {
      this.updateCustomerEntitlements(cust.getId(), customer.getEntitlements(),
      e => {
        cust.setEntitlements(e);
        successFunc(cust);
      }, entitlementsErrorFunc);
    }, customerErrorFunc);

  }

  updateCustomer(customer: Customer, successFunc: (c: Customer) => any,
      errorFunc: (e: HttpErrorResponse) => any) {

    // Don't send entitlements
    customer = Customer.copy(customer, {entitlements: null});

    this.httpClient.put(CustomerService.BASE_URL + '/' + customer.getId(), customer)
    .subscribe((c: Customer) => {
      successFunc(this.objectToCustomer(c));
    }, errorFunc);

  }

  updateCustomerEntitlements(id: number, entitlements: Entitlement[], 
    successFunc: (e: Entitlement[]) => any, 
    errorFunc: (e: HttpErrorResponse) => any) {
    if(isNullOrUndefined(entitlements)) entitlements = [];
    
    this.httpClient.put(CustomerService.BASE_URL + '/' + 
      id + "/entitlements", entitlements)
      .subscribe((e: Entitlement[]) => {
        successFunc(this.objectArrToEntitlementArr(e));
      }, errorFunc);

  }

  updateCustomerWithEntitlements(customer: Customer, 
    successFunc: (c: Customer) => any,
    customerErrorFunc: (e: HttpErrorResponse) => any = e => {
      alert('Could not update customer, see console for details.');
      console.log(e);
    },
    entitlementsErrorFunc: (e: HttpErrorResponse) => any = e => {
      console.log("Error occured updating customer entitlements.");
      customerErrorFunc(e);
    }) {
    
    this.updateCustomer(customer, cust => {
      this.updateCustomerEntitlements(cust.getId(), customer.getEntitlements(),
      e => {
        cust.setEntitlements(e);
        successFunc(cust);
      }, entitlementsErrorFunc);
    }, customerErrorFunc);

  }
}