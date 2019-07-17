import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/model/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerEntitlementsComponent } from '../customer-entitlements/customer-entitlements.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @ViewChild('entitlementsComponent') 
  customerEntitlementsComponent: CustomerEntitlementsComponent;
  customer: Customer;
  toDelete: boolean = false;
  error: HttpErrorResponse;

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.customerService.getCustomerWithEntitlements(params.get('id'),
          (p: Customer) => {
            this.customer = p
            this.customerEntitlementsComponent.useEntitlements(
              this.customer.getEntitlements()
            );
          },
          (e: HttpErrorResponse) => { 
            this.error = e;
            console.log(e);
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
