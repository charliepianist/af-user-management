import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PersonListComponent } from './routes/people/person-list/person-list.component';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { PersonDetailsComponent } from './routes/people/person-details/person-details.component';
import { HttpClientModule } from "@angular/common/http";
import { PersonFormComponent } from './routes/people/person-form/person-form.component';
import { PaginatorComponent } from './paginator/paginator.component';


const appRoutes: Routes = [
  { path: 'people', component: PersonListComponent },
  { path: 'people/new', component: PersonFormComponent },
  { path: 'people/:id',      component: PersonDetailsComponent },
  { path: 'people/:id/update',      component: PersonFormComponent },

  //the default page
  { path: '**', redirectTo: 'people' }
];




@NgModule({
  declarations: [
    AppComponent,
    PersonListComponent,
    PersonDetailsComponent,
    PersonFormComponent,
    PaginatorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
