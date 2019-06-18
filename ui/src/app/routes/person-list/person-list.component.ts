import { Component, OnInit } from '@angular/core';
import {PersonService} from "../../services/person.service";
import {Page} from "../../model/page";
import {Person} from "../../model/person";

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  constructor(private personService:PersonService) { }

  people:Page<Person>


  ngOnInit() {

    this.personService.listPeople().subscribe(p=>this.people = p);

  }

}
