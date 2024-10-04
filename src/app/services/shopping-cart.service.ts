import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private storageKey = localStorage.getItem('username')||'';
  addProductMessage:string='';
  constructor() { }

  getCartItems(): Product[] {
    if (this.storageKey.length>0) {
      let cartItems: Product[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return cartItems;
    }
    return [];
  }

  addToCart(product: any): void {
    if (this.storageKey.length>0) {
      let cartItems: Product[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const productExists = cartItems.some(item => item.productId === product.productId);
      //console.log(productExists);
      if (productExists){
        this.addProductMessage="Product is already in the shoppping cart."
      }else{
        //cartitems = cartitems.filter(item => item.productId !== product.productId);
        cartItems.push(product);
        localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
        this.addProductMessage="Successfully added a product to the shopping cart."
      }
    }
  }

  removeFromCart(productId: number): void {
    //console.log(productId);
    if (this.storageKey.length>0) {
      let cartitems = this.getCartItems();
      cartitems = cartitems.filter(item => item.productId !== productId);
      console.log(cartitems);
      localStorage.setItem(this.storageKey, JSON.stringify(cartitems));
    }
  }

  // Clear the cart
  clearCart(): void {
    if (this.storageKey.length>0) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
