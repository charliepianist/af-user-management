import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { MulticastGroup } from '../model/multicast-group';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class MulticastGroupService {

  static readonly BASE_URL = "/api/multicast-groups"

  constructor(private httpClient:HttpClient) { }

  private objectToMulticastGroup(group: {
    id: number, 
    name: string, 
    ip: string,
    port: number}): MulticastGroup {
    return Object.assign(new MulticastGroup(), group);
  }

  listMulticastGroups(successFunc: (p: Page<MulticastGroup>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {

    this.httpClient.get<Page<MulticastGroup>>(MulticastGroupService.BASE_URL, {
      params: queryParams
    }).subscribe(
      page => {
        page.content = page.content.map(
          group => this.objectToMulticastGroup(group)
        );
        successFunc(page);
      }, errorFunc);
  }

  getMulticastGroup(id: string, successFunc: (group: MulticastGroup) => any,
            errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.get<MulticastGroup>(MulticastGroupService.BASE_URL + '/' + id).subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), errorFunc);
  }

  deleteMulticastGroup(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {

    this.httpClient.delete(MulticastGroupService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createMulticastGroup(multicastGroup: MulticastGroup, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.post<MulticastGroup>(MulticastGroupService.BASE_URL, multicastGroup)
    .subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), 
      errorFunc
    );
  }
  updateMulticastGroup(multicastGroup: MulticastGroup, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {

    this.httpClient.put<MulticastGroup>(MulticastGroupService.BASE_URL + '/' + multicastGroup.getId(), multicastGroup)
    .subscribe(
      group => successFunc(this.objectToMulticastGroup(group)), 
      errorFunc
    );
  }

}
