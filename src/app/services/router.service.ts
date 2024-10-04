import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) { }

  // Authentication routes
  goToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  goToSignUpPage(): void {
    this.router.navigate(['signup']);
  }

  // Address routes
  goToAddressPage(): void {
    this.router.navigate(['address']);
  }

  goToAddAddressPage(): void {
    this.router.navigate(['address/new']);
  }

  // Product routes
  goToProductPage(): void {
    this.router.navigate(['/product']);
  }

  goToProductDetailPage(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  goToUpdateProductPage(productId: number): void {
    this.router.navigate(['product/update', productId]);
  }

  goToAddProductPage(): void {
    this.router.navigate(['product/add']);
  }

  goToLowStockProductPage(): void {
    this.router.navigate(['product/low-stock']);
  }

  // Order routes
  goToPlaceOrderPage(): void {
    this.router.navigate(['place-order']);
  }

  goToOrderDetailPage(orderId: number): void {
    this.router.navigate(['/order-detail', orderId]);
  }

  // Home route
  goToHomePage(): void {
    this.router.navigate(['/home']);
  }
}
