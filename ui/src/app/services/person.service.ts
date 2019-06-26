import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Person } from '../model/person';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  static readonly BASE_URL = "/api/people"

  constructor(private httpClient:HttpClient) { }


  listPeople(successFunc: (p: Page<Person>) => any, 
              errorFunc: (e: HttpErrorResponse) => any,
              queryParams?: any) {
    this.httpClient.get<Page<Person>>(PersonService.BASE_URL, {
      params: queryParams
    }).subscribe(
      successFunc, errorFunc);
  }

  getPerson(id: string, successFunc: (p: Person) => any,
            errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.get<Person>(PersonService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  deletePerson(id: number, successFunc: () => any, 
                errorFunc: (e: HttpErrorResponse) => any = e => { // onError
                  console.log(e);
                  alert('Delete failed, see console for error.')
                }) {
    this.httpClient.delete(PersonService.BASE_URL + '/' + id).subscribe(
      successFunc, errorFunc);
  }

  createPerson(person: Person, successFunc: (...args: any[]) => any,
                errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.post(PersonService.BASE_URL, person).subscribe(
      successFunc, errorFunc);
  }
  updatePerson(person: Person, successFunc: (...args: any[]) => any,
      errorFunc: (e: HttpErrorResponse) => any) {
    this.httpClient.put(PersonService.BASE_URL + '/' + person.getId(), person).subscribe(
    successFunc, errorFunc);
  }

}
