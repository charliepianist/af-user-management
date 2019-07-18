import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/model/page';
import { Customer } from 'src/app/model/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  constructor(private customerService:CustomerService, private router: Router, private route: ActivatedRoute) { }

  static readonly DEFAULT_SORT_FIELD = 'name';
  static readonly MAX_PAGE_SIZE = 100;
  static readonly DEFAULT_PAGE_SIZE = 20;
  static readonly MIN_PAGE_SIZE = 1;

  customerPage:Page<Customer>;
  customers:Customer[];
  errorMsg: string;
  queryParams: {
    page: number,
    size: number,
    sortBy: string,
    desc: boolean,
    disabled: boolean,
  }

  ngOnInit() {
    // Get query params/set to defaults if necessary
    this.route.queryParamMap.subscribe(queryParams => {
      this.queryParams = {
        page: parseInt(queryParams.get('page')),
        size: parseInt(queryParams.get('size')),
        sortBy: queryParams.get('sortBy'),
        desc: queryParams.get('desc') === 'true' ? true : false,
        disabled: queryParams.get('disabled') === 'true' ? true : false
      }
      if(isNaN(this.queryParams.page) || this.queryParams.page < 0)
       this.queryParams.page = 0;

      if(isNaN(this.queryParams.size) || 
        this.queryParams.size < CustomerListComponent.MIN_PAGE_SIZE) {
          this.queryParams.size = CustomerListComponent.DEFAULT_PAGE_SIZE;
        }
      if(this.queryParams.size > CustomerListComponent.MAX_PAGE_SIZE) {
        this.queryParams.size = CustomerListComponent.MAX_PAGE_SIZE;
      }

      if(!this.isCustomerField(this.queryParams.sortBy)) 
        this.queryParams.sortBy = CustomerListComponent.DEFAULT_SORT_FIELD;
    });

    this.customerService.listCustomers(
      p => { 
        // success, returned Page<Customer> object
        this.customerPage = p;
        this.customers = p.content;
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
    disabled = this.queryParams.disabled
  }: {
    page?: number,
    size?: number,
    sortBy?: string,
    desc?: boolean,
    disabled?: boolean
  } = this.queryParams) {

    this.router.navigate(['/customers'], {
      queryParams: {
        page: page,
        size: size,
        sortBy: sortBy,
        desc: desc,
        disabled: disabled
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
    this.router.navigate(['/customers']).then(() => {
      this.reinitialize();
    });
  }

  goToPage(num: number) { // input number indexed at 0 (same as Spring)
    this.queryParams.page = num;
    this.refresh();
  }

  toggleDisabled() {
    let params = this.defaultParams();
    params.disabled = !this.queryParams.disabled;
    this.refresh(params);
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

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id,
      () => { this.reinitialize() }); //reload component on success 
  }

  isCustomerField(str: string): boolean {
    if(str === 'id') return true;
    if(str === 'name') return true;
    if(str === 'userId') return true;
    if(str === 'password') return true;
    return false;
  }
  
  defaultParams() {
    return {
      page: 0,
      size: CustomerListComponent.DEFAULT_PAGE_SIZE,
      sortBy: CustomerListComponent.DEFAULT_SORT_FIELD,
      desc: false,
      disabled: false
    }
  }
}
