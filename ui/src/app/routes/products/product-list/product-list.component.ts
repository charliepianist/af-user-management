import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/model/page';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productService:ProductService, 
    private router: Router, private route: ActivatedRoute,
    private authService: AuthService) { }

  static readonly DEFAULT_SORT_FIELD = 'name';
  static readonly MAX_PAGE_SIZE = 100;
  static readonly DEFAULT_PAGE_SIZE = 20;
  static readonly MIN_PAGE_SIZE = 1;

  productPage:Page<Product>;
  products:Product[];
  errorMsg: string;
  queryParams: {
    page: number,
    size: number,
    sortBy: string,
    desc: boolean,
  }
  admin: boolean = AuthService.ADMIN_DEFAULT;

  ngOnInit() {
    this.authService.getRoles(
      roles => {
        this.admin = roles.includes(AuthService.ADMIN);
      }
    )
    this.processQueryParams();
  }

  processQueryParams() {
    // Get query params/set to defaults if necessary
    this.route.queryParamMap.subscribe(queryParams => {
      this.queryParams = {
        page: parseInt(queryParams.get('page')),
        size: parseInt(queryParams.get('size')),
        sortBy: queryParams.get('sortBy'),
        desc: queryParams.get('desc') === 'true' ? true : false
      }
      if(isNaN(this.queryParams.page) || this.queryParams.page < 0)
       this.queryParams.page = 0;

      if(isNaN(this.queryParams.size) || 
        this.queryParams.size < ProductListComponent.MIN_PAGE_SIZE) {
          this.queryParams.size = ProductListComponent.DEFAULT_PAGE_SIZE;
        }
      if(this.queryParams.size > ProductListComponent.MAX_PAGE_SIZE) {
        this.queryParams.size = ProductListComponent.MAX_PAGE_SIZE;
      }

      if(!this.isProductField(this.queryParams.sortBy)) 
        this.queryParams.sortBy = ProductListComponent.DEFAULT_SORT_FIELD;
      
      this.listProducts();
    });
  }

  listProducts() {
    this.productService.listProducts(
      p => { 
        // success, returned Page<Product> object
        this.productPage = p;
        this.products = p.content;
      },
      //onError
      e => {console.log(e); this.errorMsg = e.message;},
      this.queryParams);
  }

  // Reinitalize component AND parameters
  refresh({
    page = this.queryParams.page,
    size = this.queryParams.size,
    sortBy = this.queryParams.sortBy,
    desc = this.queryParams.desc,
  }: {
    page?: number,
    size?: number,
    sortBy?: string,
    desc?: boolean
  } = this.queryParams) {

    this.router.navigate(['/products'], {
      queryParams: {
        page: page,
        size: size,
        sortBy: sortBy,
        desc: desc,
      }
    }).then(() => {
      this.reinitialize();
    });
  }

  // Reinitialize component
  reinitialize() {
    this.ngOnInit();
  }

  toFirstPage() {
    this.router.navigate(['/products']).then(() => {
      this.reinitialize();
    });
  }

  goToPage(num: number) { // input number indexed at 0 (same as Spring)
    this.queryParams.page = num;
    this.refresh();
  }

  isSortAsc(property: string) {
    return property === this.queryParams.sortBy && !this.queryParams.desc;
  }
  isSortDesc(property: string) {
    return property === this.queryParams.sortBy && this.queryParams.desc;
  }

  // User clicks on header of a column to sort/switch ascending/descending
  sort(property: string) {
    if(this.queryParams.sortBy === property) {
      // switch between ascending and descending
      this.queryParams.desc = !this.queryParams.desc;
    }else {
      // change property to sort by
      this.queryParams.sortBy = property;
      this.queryParams.desc = false;
    }
    this.queryParams.page = 0;
    this.refresh();
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id,
      () => { this.reinitialize() }); //reload component on success 
  }

  isProductField(str: string): boolean {
    if(str === 'id') return true;
    if(str === 'name') return true;
    return false;
  }
}
