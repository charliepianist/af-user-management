import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-multicast-group-details',
  templateUrl: './multicast-group-details.component.html',
  styleUrls: ['./multicast-group-details.component.css']
})
export class MulticastGroupDetailsComponent implements OnInit {

  multicastGroup: MulticastGroup;
  products: Product[];
  toDelete: boolean = false;
  error: HttpErrorResponse;

  constructor(private multicastGroupService: MulticastGroupService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.multicastGroupService.getMulticastGroupWithProducts(params.get('id'),
          (group: MulticastGroup) => {
            this.multicastGroup = group;
            this.products = group.getProducts();
            this.products.sort((a, b) => {
              if(a.getName() > b.getName()) return 1;
              if(a.getName() < b.getName()) return -1;
              return 0;
            })
          },
          (e: HttpErrorResponse) => { 
            this.error = e;
            console.log(e);
          }
        );
      }
    );
  }

  deleteMulticastGroup() {
    this.multicastGroupService.deleteMulticastGroup(this.multicastGroup.getId(),
      () => { this.router.navigate(['/multicast-groups']) });
  }

}
