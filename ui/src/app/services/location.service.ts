import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Location } from '../model/location';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  static readonly BASE_URL = "/api/locations"

  constructor(private httpClient:HttpClient) { }


  listLocations(successFunc: (p: Page<Location>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Location>>(LocationService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          l => Object.assign(new Location(), l)
        );
        successFunc(page);
      }, errorFunc);
  }

  getLocation(id: string, successFunc: (p: Location) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Location>(LocationService.BASE_URL + '/' + id).subscribe(
      l => successFunc(Object.assign(new Location(), l)), errorFunc);
  }

  deleteLocation(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {
    this.httpClient.delete(LocationService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createLocation(location: Location, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.post(LocationService.BASE_URL, location).subscribe(
      successFunc, errorFunc);
  }
  updateLocation(location: Location, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.put(LocationService.BASE_URL + '/' + location.getId(), location).subscribe(
    successFunc, errorFunc);
  }

}
