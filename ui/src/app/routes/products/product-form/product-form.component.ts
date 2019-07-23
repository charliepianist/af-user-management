import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductMulticastGroupsComponent } from '../product-multicast-groups/product-multicast-groups.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  @ViewChild(ProductMulticastGroupsComponent)
  multicastGroupsComponent: ProductMulticastGroupsComponent;
  id: string; // null if invalid ID or no ID passed in
  idNum: number = null; 
  errorMsg: string = null;
  product: Product = new Product();
  origName: string = null;
  name: string = null; // Binded by ngModel
  newName: string = null;
  invalidSubmit: boolean = false; // when submit clicked with invalid input
  submissionErrorMsg: string = null;
  updateMulticast: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    let errorFunc = (e: HttpErrorResponse) => {
      this.errorMsg = e.message; 
      console.log(e);
    };
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if(this.isUpdating()) this.productService.getProductWithMulticastGroups(this.id, 
          p => {
            this.product = p;
            this.idNum = this.product.getId();

            this.origName = this.product.getName();
            this.name = this.origName;

            this.multicastGroupsComponent.useGroups(
              this.product.getMulticastGroups());
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

  toggleUpdateMode() {
    this.updateMulticast = !this.updateMulticast;
    if(this.updateMulticast) {
      this.newName = this.name;
      this.name = this.origName;
    }else {
      this.name = this.newName;
    }
  }
  
  submitButton() {
    if(this.validateName()) {
      this.invalidSubmit = true;
    }else {
      let newProduct = new Product(
        this.idNum, 
        this.name);

      let goToDetails = () => {
        this.router.navigate(['/products', this.idNum]);
      }
      let successFunc = (p: Product) => {
        this.router.navigate(['/products', p.getId()]);
      }
      let errorFunc = (e: HttpErrorResponse) => {
        this.submissionErrorMsg = e.error.status + ' ' + 
                                  e.error.error + ': ' +
                                  e.error.message;
        console.log(e);
      }
      if(this.isUpdating()) {
        // Updating an already existing product without entitlements
        if(this.updateMulticast) {
          this.productService.updateProductMulticastGroups(
            this.idNum,
            this.multicastGroupsComponent.getSelectedGroups(),
            goToDetails, errorFunc);
        }else {
          this.productService.updateProduct(newProduct, successFunc, 
            errorFunc);
        }
      }else {
        // Creating a new product without multicast groups
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
