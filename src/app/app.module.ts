import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
import { AddressComponent } from './components/address/address/address.component';
import { GeneralInfoComponent } from './components/home/general-info/general-info.component';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { CheckoutPageComponent } from './components/orders/checkout-page/checkout-page.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ProductComponent } from './components/products/product/product.component';
import { RestockProductComponent } from './components/products/restock-product/restock-product.component';
import { ShoppingCartComponent } from './components/products/shopping-cart/shopping-cart.component';
import { UpdateProductComponent } from './components/products/update-product/update-product.component';
import { WatchListComponent } from './components/products/watch-list/watch-list.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddressService } from './services/address.service';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { RouterService } from './services/router.service';
import { OrdersComponent } from './components/orders/orders/orders.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    AddressComponent,
    NavComponent,
    AddAddressComponent,
    GeneralInfoComponent,
    OrderDetailsComponent,
    ProductDetailsComponent,
    ProductComponent,
    WatchListComponent,
    AddProductComponent,
    UpdateProductComponent,
    RestockProductComponent,
    ShoppingCartComponent,
    CheckoutPageComponent,
    AppComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    RouterService,
    ProductService,
    AddressService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
