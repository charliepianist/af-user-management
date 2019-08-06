import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from 'src/app/model/location';
import { LocationService } from 'src/app/services/location.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  location: Location;
  toDelete: boolean = false;
  error: HttpErrorResponse;
  admin: boolean = AuthService.ADMIN_DEFAULT;

  constructor(private locationService: LocationService, 
    private route: ActivatedRoute, private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.getRoles(roles => {
      this.admin = roles.includes(AuthService.ADMIN);
    })
    this.getLocation();
  }

  getLocation() {
    this.route.paramMap.subscribe(
      params => {
        this.locationService.getLocation(params.get('id'),
          (l: Location) => this.location = l,
          (e: HttpErrorResponse) => { 
            this.error = e;
            console.log(e);
          }
        );
      }
    );
  }

  deleteLocation() {
    this.locationService.deleteLocation(this.location.getId(),
      () => { this.router.navigate(['/locations']) });
  }

}
