import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { Location } from 'src/app/model/location';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  id: string; // null if invalid ID or no ID passed in
  idNum: number = null; 
  errorMsg: string = null;
  location: Location = new Location();
  origName: string = null;
  name: string = null;
  origCode: string = null;
  code: string = null;
  invalidSubmit: boolean = false; // when submit clicked with invalid input
  submissionErrorMsg: string = null;

  constructor(private router: Router, private route: ActivatedRoute, private locationService: LocationService) {}

  ngOnInit() {
    let errorFunc = (e: HttpErrorResponse) => {
      this.errorMsg = e.message; 
      console.log(e);
    };
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if(this.isUpdating()) this.locationService.getLocation(this.id, 
          p => {
            this.location = p
            this.idNum = this.location.getId();

            this.origName = this.location.getName();
            this.name = this.origName;

            this.origCode = this.location.getCode();
            this.code = this.origCode;
          },
          e => { 
            this.id = null; 
            errorFunc(e);
          });
      },
      errorFunc);
  }

  validateName(): string {
    if(!this.name) return 'Please enter a name.';
    return null;
  }
  validateCode(): string {
    if(!this.code) return 'Please enter a code.';
    return null;
  }

  isUpdating(): boolean {
    if(this.id) return true;
    return false;
  }
  
  submitButton() {
    if(this.validateName() || this.validateCode()) {
      this.invalidSubmit = true;
    }else {
      let newLocation = new Location(
        this.idNum, 
        this.code, 
        this.name);

      let successFunc = (l: Location) => {
        this.router.navigate(['/locations', l.getId()]);
      };
      let errorFunc = (e: HttpErrorResponse) => {
        this.submissionErrorMsg = e.error.status + ' ' + 
                                  e.error.error + ': ' +
                                  e.error.message;
        console.log(e);
      }
      if(this.isUpdating()) {
        // Updating an already existing location without entitlements
        this.locationService.updateLocation(newLocation, successFunc, 
          errorFunc);
      }else {
        // Creating a new location without entitlements
        this.locationService.createLocation(newLocation, successFunc,
          errorFunc);
      }
    }
  }

  cancelButton() {
    if(this.isUpdating()) {
      this.router.navigate(['/locations', this.location.getId()]);
    }else this.router.navigate(['/locations']);
  }
}
