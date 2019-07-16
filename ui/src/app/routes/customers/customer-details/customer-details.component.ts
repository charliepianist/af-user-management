import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/model/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerEntitlementsComponent } from '../customer-entitlements/customer-entitlements.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @ViewChild(CustomerEntitlementsComponent) 
  customerEntitlementsComponent: CustomerEntitlementsComponent;
  customer: Customer;
  toDelete: boolean = false;

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.customerService.getCustomerWithEntitlements(params.get('id'),
          p => {
            this.customer = p
            this.customerEntitlementsComponent.useEntitlements(
              this.customer.getEntitlements()
            );
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
