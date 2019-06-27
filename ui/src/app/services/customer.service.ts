import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Customer } from '../model/customer';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  static readonly BASE_URL = "/api/customers"

  constructor(private httpClient:HttpClient) { }


  listCustomers(successFunc: (p: Page<Customer>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Customer>>(CustomerService.BASE_URL, {
      params: queryParams
    }).subscribe(
      successFunc, errorFunc);
  }

  getCustomer(id: string, successFunc: (p: Customer) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Customer>(CustomerService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
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
