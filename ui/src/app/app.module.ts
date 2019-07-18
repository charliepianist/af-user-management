import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomerListComponent } from './routes/customers/customer-list/customer-list.component';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CustomerDetailsComponent } from './routes/customers/customer-details/customer-details.component';
import { HttpClientModule } from "@angular/common/http";
import { CustomerFormComponent } from './routes/customers/customer-form/customer-form.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ProductListComponent } from './routes/products/product-list/product-list.component';
import { CustomerEntitlementsComponent } from './routes/customers/customer-entitlements/customer-entitlements.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { ProductDetailsComponent } from './routes/products/product-details/product-details.component';
import { ProductFormComponent } from './routes/products/product-form/product-form.component';


const appRoutes: Routes = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id',      component: CustomerDetailsComponent },
  { path: 'customers/:id/update',      component: CustomerFormComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products/:id/update', component: ProductFormComponent },

  //the default page
  { path: '**', redirectTo: 'customers' }
];




@NgModule({
  declarations: [
    AppComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    CustomerFormComponent,
    PaginatorComponent,
    ProductListComponent,
    CustomerEntitlementsComponent,
    DeleteConfirmationComponent,
    ProductDetailsComponent,
    ProductFormComponent,
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
