import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  multicastGroups: MulticastGroup[] = [];
  product: Product;
  toDelete: boolean = false;
  error: HttpErrorResponse;
  admin: boolean = AuthService.ADMIN_DEFAULT;

  constructor(private productService: ProductService, 
    private route: ActivatedRoute, private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.getRoles(
      roles => {
        this.admin = roles.includes(AuthService.ADMIN);
      });
    this.getProduct();
  }

  getProduct() {
    this.route.paramMap.subscribe(
      params => {
        this.productService.getProductWithMulticastGroups(params.get('id'),
          (p: Product) => {
            this.product = p;
            this.multicastGroups = this.product.getMulticastGroups();
            this.multicastGroups.sort(MulticastGroup.DEFAULT_SORT);
          },
          (e: HttpErrorResponse) => { 
            this.error = e;
            console.log(e);
          }
        );
      }
    );
  }

  deleteProduct() {
    this.productService.deleteProduct(this.product.getId(),
      () => { this.router.navigate(['/products']) });
  }

}
