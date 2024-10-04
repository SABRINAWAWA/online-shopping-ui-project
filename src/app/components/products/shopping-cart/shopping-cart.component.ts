import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { RouterService } from '../../../services/router.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  userRole: string | null = '';
  constructor(
    private cartService: ShoppingCartService,
    private routerService: RouterService,
    private authService: AuthService) { }
  
  async ngOnInit(): Promise<void> {
    this.userRole = this.authService.getUserRole();
  }
  
  async addToShoppingCart(product: Product) {
    await this.cartService.addToCart(product);
  }

  async removeFromCart(id: number) {
    await this.cartService.removeFromCart(id);
    await this.cartService.getCartItems();
  }
  
  getCartItems(): any[] {
    return this.cartService.getCartItems();
  }

  async goToPlaceOrderPage(): Promise<void> {
    await this.routerService.goToPlaceOrderPage();
  }
}
