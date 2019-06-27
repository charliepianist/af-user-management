import { Component, OnInit, enableProdMode, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
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

  @ViewChild('paginator') paginator: PaginatorComponent;
  customerPage:Page<Customer>;
  customers:Customer[];
  errorMsg: string;
  toDelete: number[];
  queryParams: {
    page: number,
    size: number,
    sortBy: string,
    desc: boolean,
  }

  ngOnInit() {
    this.toDelete = new Array();

    // Get query params/set to defaults if necessary
    this.route.queryParamMap.subscribe(queryParams => {
      this.queryParams = {
        page: parseInt(queryParams.get('page')),
        size: parseInt(queryParams.get('size')),
        sortBy: queryParams.get('sortBy'),
        desc: queryParams.get('desc') === 'true' ? true : false,
      }
      if(isNaN(this.queryParams.page) || this.queryParams.page < 0)
       this.queryParams.page = 0;

      if(isNaN(this.queryParams.size) || this.queryParams.size < 1) 
        this.queryParams.size = 20;
      if(this.queryParams.size > 100) this.queryParams.size = 100;

      if(!this.isCustomerField(this.queryParams.sortBy)) 
        this.queryParams.sortBy = 'id';
    });

    this.customerService.listCustomers(
      p => { 
        // success, returned Page<Customer> object
        this.customerPage = p;
        this.customers = p.content.map(
          customer => Object.assign(new Customer(), customer));
      },
      //onError
      e => {console.log(e); this.errorMsg = e.message;},
      this.queryParams);
  }

  // Reinitalize component AND parameters
  refresh() {
    this.router.navigate(['/customers'], {
      queryParams: this.queryParams
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
      () => { this.ngOnInit() }); //reload component on success 
  }

  isCustomerField(str: string): boolean {
    if(str === 'id') return true;
    if(str === 'name') return true;
    if(str === 'userId') return true;
    if(str === 'password') return true;
    return false;
  }
}
