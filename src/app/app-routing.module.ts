import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
import { AddressComponent } from './components/address/address/address.component';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutPageComponent } from './components/orders/checkout-page/checkout-page.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';
import { OrdersComponent } from './components/orders/orders/orders.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ProductComponent } from './components/products/product/product.component';
import { RestockProductComponent } from './components/products/restock-product/restock-product.component';
import { UpdateProductComponent } from './components/products/update-product/update-product.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'signup',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'address',
    component: AddressComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'address/new',
    component: AddAddressComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'order-detail/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product/add',
    component: AddProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product/update/:id',
    component: UpdateProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product/low-stock',
    component: RestockProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'place-order',
    component: CheckoutPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  }
];