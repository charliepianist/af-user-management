import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Product } from '../model/product';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  static readonly BASE_URL = "/api/products"

  constructor(private httpClient:HttpClient) { }


  listProducts(successFunc: (p: Page<Product>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Product>>(ProductService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          p => Object.assign(new Product(), p));
        successFunc(page);
      }, errorFunc);
  }

  getProduct(id: string, successFunc: (p: Product) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Product>(ProductService.BASE_URL + '/' + id).subscribe(
      p => successFunc(Object.assign(new Product(), p)),
      errorFunc);
  }

  deleteProduct(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {
    this.httpClient.delete(ProductService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createProduct(product: Product, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.post(ProductService.BASE_URL, product).subscribe(
      successFunc, errorFunc);
  }
  updateProduct(product: Product, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.put(ProductService.BASE_URL + '/' + product.getId(), product).subscribe(
    successFunc, errorFunc);
  }

}
