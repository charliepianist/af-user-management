import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Customer } from '../model/customer';
import { Page } from '../model/page';
import { Product } from '../model/product';
import { Location } from '../model/location';
import { Entitlement } from '../model/entitlement';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  static readonly BASE_URL = "/api/customers"

  constructor(private httpClient:HttpClient) { }

  private objectToCustomer(cust: {name: string, userId: string, 
    id: number, password: string, entitlements: Entitlement[]}): Customer {
    if(cust.entitlements) {
      cust.entitlements.forEach(e => {
        e.product = Object.assign(new Product(), e.product);
        e.location = Object.assign(new Location(), e.location);
        if(e.expirationDate) 
          e.expirationDate = new Date(e.expirationDate);
      });
      cust.entitlements = cust.entitlements.map(
        e => Object.assign(new Entitlement(), e)
      );
    }else cust.entitlements = new Array();
    return Object.assign(new Customer(), cust);
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

  deleteCustomer(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {
    this.httpClient.delete(CustomerService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createCustomer(customer: Customer, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.post(CustomerService.BASE_URL, customer).subscribe(
      successFunc, errorFunc);
  }
  updateCustomer(customer: Customer, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.put(CustomerService.BASE_URL + '/' + customer.getId(), customer).subscribe(
    successFunc, errorFunc);
  }

}
