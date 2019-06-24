import { Component, OnInit } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/model/person';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent implements OnInit {

  person: Person;
  error: HttpErrorResponse;
  toDelete: boolean = false;

  constructor(private personService: PersonService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.personService.getPerson(params.get('id'),
          p => this.person = Object.assign(new Person(), p),
          e => { // onError
            console.log(e);
            this.error = e;
          }
        );
      }
    );
  }

  deletePerson() {
    this.personService.deletePerson(this.person.getId(),
      () => { this.router.navigate(['/people']) });
  }

}
