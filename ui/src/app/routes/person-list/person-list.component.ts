import { Component, OnInit, enableProdMode } from '@angular/core';
import {PersonService} from "../../services/person.service";
import {Page} from "../../model/page";
import {Person} from "../../model/person";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  constructor(private personService:PersonService, private router: Router, private route: ActivatedRoute) { }

  peoplePage:Page<Person>
  people:Person[]
  error: HttpErrorResponse;
  pageNumber: number;
  totalPages: number;
  startElement: number;
  endElement: number;
  totalElements: number;
  toDelete: number[];

  ngOnInit() {
    this.toDelete = new Array();
    this.personService.listPeople(
      p => { 
        // success, returned Page<Person> object
        this.peoplePage = p;
        this.pageNumber = p.number + 1;
        this.totalPages = p.totalPages;
        this.startElement = p.pageable.offset + 1;
        this.endElement = p.pageable.offset + p.numberOfElements;
        this.totalElements = p.totalElements;

        this.people = p.content.map(
          person => Object.assign(new Person(), person));
      },
      //onError
      e => {console.log(e); this.error = e;}
      );
  }

  deletePerson(id: number) {
    this.personService.deletePerson(id,
      () => { this.ngOnInit() }); //reload component on success 
  }
}
