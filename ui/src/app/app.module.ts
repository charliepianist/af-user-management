import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PersonListComponent } from './routes/person-list/person-list.component';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import { PersonDetailsComponent } from './routes/person-details/person-details.component';
import {HttpClientModule} from "@angular/common/http";


const appRoutes: Routes = [
  { path: 'people', component: PersonListComponent },
  { path: 'people/:id',      component: PersonDetailsComponent },

  //the default page
  { path: '**', component: PersonListComponent }
];




@NgModule({
  declarations: [
    AppComponent,
    PersonListComponent,
    PersonDetailsComponent,
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
