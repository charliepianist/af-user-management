import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/model/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customer: Customer;
  error: HttpErrorResponse;
  toDelete: boolean = false;

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.customerService.getCustomer(params.get('id'),
          p => this.customer = Object.assign(new Customer(), p),
          e => { // onError
            console.log(e);
            this.error = e;
          }
        );
      }
    );
  }

  deleteCustomer() {
    this.customerService.deleteCustomer(this.customer.getId(),
      () => { this.router.navigate(['/customers']) });
  }

}
