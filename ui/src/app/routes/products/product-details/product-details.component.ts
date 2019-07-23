import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { MulticastGroup } from 'src/app/model/multicast-group';

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

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.productService.getProductWithMulticastGroups(params.get('id'),
          (p: Product) => {
            this.product = p;
            this.multicastGroups = this.product.getMulticastGroups();
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
