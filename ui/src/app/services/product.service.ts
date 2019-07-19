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

  private objectToProduct(prod: {
    id: number, 
    name: string
  }): Product {
    return Object.assign(new Product(), prod);
  }

  listProducts(successFunc: (p: Page<Product>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Product>>(ProductService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          p => this.objectToProduct(p));
        successFunc(page);
      }, errorFunc);
  }

  getProduct(id: string, successFunc: (p: Product) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Product>(ProductService.BASE_URL + '/' + id).subscribe(
      p => successFunc(this.objectToProduct(p)),
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
    this.httpClient.post<Product>(ProductService.BASE_URL, product)
    .subscribe(
      p => successFunc(this.objectToProduct(p)), 
      errorFunc
    );
  }
  updateProduct(product: Product, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.put<Product>(ProductService.BASE_URL + '/' + product.getId(), product)
    .subscribe(
      p => successFunc(this.objectToProduct(p)),
      errorFunc
    );
  }

}
