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
import { LocationListComponent } from './routes/locations/location-list/location-list.component';
import { LocationDetailsComponent } from './routes/locations/location-details/location-details.component';
import { LocationFormComponent } from './routes/locations/location-form/location-form.component';
import { MulticastGroupListComponent } from './routes/multicast-groups/multicast-group-list/multicast-group-list.component';
import { MulticastGroupDetailsComponent } from './routes/multicast-groups/multicast-group-details/multicast-group-details.component';
import { MulticastGroupFormComponent } from './routes/multicast-groups/multicast-group-form/multicast-group-form.component';
import { ProductMulticastGroupsComponent } from './routes/products/product-multicast-groups/product-multicast-groups.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';


const appRoutes: Routes = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id',      component: CustomerDetailsComponent },
  { path: 'customers/:id/update',      component: CustomerFormComponent },

  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products/:id/update', component: ProductFormComponent },

  { path: 'locations', component: LocationListComponent },
  { path: 'locations/new', component: LocationFormComponent },
  { path: 'locations/:id', component: LocationDetailsComponent },
  { path: 'locations/:id/update', component: LocationFormComponent },

  { path: 'multicast-groups', component: MulticastGroupListComponent },
  { path: 'multicast-groups/new', component: MulticastGroupFormComponent },
  { path: 'multicast-groups/:id', component: MulticastGroupDetailsComponent },
  { path: 'multicast-groups/:id/update', component: MulticastGroupFormComponent },

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
    LocationListComponent,
    LocationDetailsComponent,
    LocationFormComponent,
    MulticastGroupListComponent,
    MulticastGroupDetailsComponent,
    MulticastGroupFormComponent,
    ProductMulticastGroupsComponent,
    TooltipComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes,{useHash: true}),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
