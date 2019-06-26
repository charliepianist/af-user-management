import { Component, OnInit, enableProdMode } from '@angular/core';
import {PersonService} from "../../services/person.service";
import {Page} from "../../model/page";
import {Person} from "../../model/person";
import { Router, ActivatedRoute } from '@angular/router';
import { isNumber } from 'util';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  constructor(private personService:PersonService, private router: Router, private route: ActivatedRoute) { }

  peoplePage:Page<Person>
  people:Person[]
  errorMsg: string;
  pageNumber: number;
  totalPages: number;
  startElement: number;
  endElement: number;
  totalElements: number;
  toDelete: number[];
  queryParams: {
    page: number,
    size: number,
    sortBy: string,
    desc: boolean,
  }
  first: boolean;
  last: boolean;
  pageToGoTo: number;

  ngOnInit() {
    this.toDelete = new Array();

    // Get query params/set to defaults if necessary
    this.route.queryParamMap.subscribe(queryParams => {
      this.queryParams = {
        page: parseInt(queryParams.get('page')),
        size: parseInt(queryParams.get('size')),
        sortBy: queryParams.get('sortBy'),
        desc: queryParams.get('desc') === 'true' ? true : false,
      }
      if(isNaN(this.queryParams.page) || this.queryParams.page < 0)
       this.queryParams.page = 0;

      if(isNaN(this.queryParams.size) || this.queryParams.size < 1) 
        this.queryParams.size = 20;
      if(this.queryParams.size > 100) this.queryParams.size = 100;

      if(!this.isPersonField(this.queryParams.sortBy)) 
        this.queryParams.sortBy = 'id';
      
      this.pageToGoTo = this.queryParams.page + 1;
    });

    this.personService.listPeople(
      p => { 
        // success, returned Page<Person> object
        this.peoplePage = p;
        this.pageNumber = p.number + 1;
        this.totalPages = p.totalPages;
        this.startElement = p.pageable.offset + 1;
        this.endElement = p.pageable.offset + p.numberOfElements;
        this.totalElements = p.totalElements;
        this.first = p.first;
        this.last = p.last;

        this.people = p.content.map(
          person => Object.assign(new Person(), person));
      },
      //onError
      e => {console.log(e); this.errorMsg = e.message;},
      this.queryParams);
  }

  // Reinitalize component AND parameters
  refresh() {
    this.router.navigate(['/people'], {
      queryParams: this.queryParams
    }).then(() => {
      this.reinitialize();
    });
  }

  // Reinitialize component
  reinitialize() {
    this.ngOnInit();
  }

  nextPage() {
    this.queryParams.page++;
    this.refresh();
  }

  previousPage() {
    this.queryParams.page--;
    this.refresh();
  }

  toFirstPage() {
    this.router.navigate(['/people']).then(() => {
      this.reinitialize();
    });
  }

  goToPage() {
    this.pageToGoTo = Math.min(this.pageToGoTo, this.totalPages);
    this.queryParams.page = this.pageToGoTo - 1;
    this.refresh();
  }

  isSortAsc(property: string) {
    return property === this.queryParams.sortBy && !this.queryParams.desc;
  }
  isSortDesc(property: string) {
    return property === this.queryParams.sortBy && this.queryParams.desc;
  }

  // User clicks on header of a column to sort/switch ascending/descending
  sort(property: string) {
    if(this.queryParams.sortBy === property) {
      // switch between ascending and descending
      this.queryParams.desc = !this.queryParams.desc;
    }else {
      // change property to sort by
      this.queryParams.sortBy = property;
      this.queryParams.desc = false;
    }
    this.queryParams.page = 0;
    this.refresh();
  }

  deletePerson(id: number) {
    this.personService.deletePerson(id,
      () => { this.ngOnInit() }); //reload component on success 
  }

  isPersonField(str: string): boolean {
    if(str === 'id') return true;
    if(str === 'name') return true;
    if(str === 'userId') return true;
    if(str === 'password') return true;
    return false;
  }
}
