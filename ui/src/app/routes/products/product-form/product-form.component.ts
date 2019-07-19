import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/product';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  id: string; // null if invalid ID or no ID passed in
  idNum: number = null; 
  errorMsg: string = null;
  product: Product = new Product();
  origName: string = null;
  name: string = null;
  invalidSubmit: boolean = false; // when submit clicked with invalid input
  submissionErrorMsg: string = null;

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    let errorFunc = (e: HttpErrorResponse) => {
      this.errorMsg = e.message; 
      console.log(e);
    };
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if(this.isUpdating()) this.productService.getProduct(this.id, 
          p => {
            this.product = p
            this.idNum = this.product.getId();

            this.origName = this.product.getName();
            this.name = this.origName;
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
    return null;
  }

  isUpdating(): boolean {
    if(this.id) return true;
    return false;
  }
  
  submitButton() {
    if(this.validateName()) {
      this.invalidSubmit = true;
    }else {
      let newProduct = new Product(
        this.idNum, 
        this.name);

      let successFunc = (p: Product) => {
        this.router.navigate(['/products', p.getId()]);
      };
      let errorFunc = (e: HttpErrorResponse) => {
        this.submissionErrorMsg = e.error.status + ' ' + 
                                  e.error.error + ': ' +
                                  e.error.message;
        console.log(e);
      }
      if(this.isUpdating()) {
        // Updating an already existing product without entitlements
        this.productService.updateProduct(newProduct, successFunc, 
          errorFunc);
      }else {
        // Creating a new product without entitlements
        this.productService.createProduct(newProduct, successFunc,
          errorFunc);
      }
    }
  }

  cancelButton() {
    if(this.isUpdating()) {
      this.router.navigate(['/products', this.product.getId()]);
    }else this.router.navigate(['/products']);
  }
}
