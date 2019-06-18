import { Injectable } from '@angular/core';
import {Page} from "../model/page";
import {Person} from "../model/person";
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PersonService {



  constructor(private httpClient:HttpClient) { }


  listPeople():Observable<Page<Person>>{
    return this.httpClient.get<Page<Person>>("/api/people");
  }

}
