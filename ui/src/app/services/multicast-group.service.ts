import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { MulticastGroup } from '../model/multicast-group';
import { Page } from '../model/page';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class MulticastGroupService {

  static readonly BASE_URL = "/api/multicast-groups"

  constructor(private httpClient:HttpClient) { }

  private objectToMulticastGroup(group: {
    id: number, 
    name: string, 
    ip: string,
    port: number}): MulticastGroup {
    return Object.assign(new MulticastGroup(), group);
  }

  private objectArrToProductArr(products: Product[]): Product[] {
    return products.map(p => Object.assign(new Product(), p));
  }

  listMulticastGroups(successFunc: (p: Page<MulticastGroup>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {

    this.httpClient.get<Page<MulticastGroup>>(MulticastGroupService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          group => this.objectToMulticastGroup(group)
        );
        successFunc(page);
      }, errorFunc);
  }

  getMulticastGroup(id: string, successFunc: (group: MulticastGroup) => any,
            errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.get<MulticastGroup>(MulticastGroupService.BASE_URL + '/' + id).subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), errorFunc);
  }

  getMulticastGroupProducts(id: string, successFunc: (products: Product[]) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Product[]>(MulticastGroupService.BASE_URL + 
      "/" + id + "/products").subscribe(
        products => successFunc(this.objectArrToProductArr(products)),
        errorFunc);
  }

  getMulticastGroupWithProducts(id: string, successFunc: (group: MulticastGroup) => any,
    groupErrorFunc: (e: HttpErrorResponse) => any = e => {
      alert('Could not load multicast group, see console for details.');
      console.log(e);
    }, productsErrorFunc: (e: HttpErrorResponse) => any = e => {
      console.log('Error occured loading multicast group products.');
      groupErrorFunc(e);
    }) {
      this.getMulticastGroup(id, group => {
        this.getMulticastGroupProducts(id, prods => {
          group.setProducts(prods);
          successFunc(group);
        }, productsErrorFunc);
      }, groupErrorFunc);
    }

  deleteMulticastGroup(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {

    this.httpClient.delete(MulticastGroupService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createMulticastGroup(multicastGroup: MulticastGroup, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.post<MulticastGroup>(MulticastGroupService.BASE_URL, multicastGroup)
    .subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), 
      errorFunc
    );
  }
  updateMulticastGroup(multicastGroup: MulticastGroup, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.put<MulticastGroup>(MulticastGroupService.BASE_URL + '/' + multicastGroup.getId(), multicastGroup)
    .subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), 
      errorFunc
    );
  }

}
