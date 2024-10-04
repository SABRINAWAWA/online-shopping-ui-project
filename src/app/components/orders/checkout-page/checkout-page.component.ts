import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { Address } from '../../../models/address';
import { AddressService } from '../../../services/address.service';
import { OrdersService } from '../../../services/orders.service';
import { RouterService } from '../../../services/router.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  userRole: string = '';
  cartItems: any[] = [];
  addresses: Address[] = [];
  orderId: number = 0;
  checkoutMessage: string = '';
  placeOrderForm!: FormGroup;

  constructor(
    private cartService: ShoppingCartService,
    private routerService: RouterService,
    private fb: FormBuilder,
    private addressService: AddressService,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
    this.cartItems = this.cartService.getCartItems();
    this.fetchAddresses();
    this.placeOrderForm = this.fb.group({
      address: [0, Validators.required], // Select an address
      orderitems: this.fb.array([])
    });
    this.populateOrderItems();
    //console.log(this.cartItems)
  }

  populateOrderItems() {
    const items = this.cartService.getCartItems();
    //console.log(items)
    const orderitems = this.placeOrderForm.get('orderitems') as FormArray;
    items.forEach(item => {
      orderitems.push(this.fb.group({
        productId: [item.productId],
        name: [item.name],
        description: [item.description],
        retailPrice: [item.retailPrice],
        quantity: [1]  // Default quantity is set to 1
      }));
    });
    //console.log(orderitems);
  }

  removeOrderItem(id: number) {
    const items = this.cartService.getCartItems();
    //console.log(items)
    const orderitems = this.placeOrderForm.get('orderitems') as FormArray;
    if (id >= 0 && id < orderitems.length) {
      const productId = orderitems.at(id).get('productId')?.value; // Get product ID
      orderitems.removeAt(id); // Remove from FormArray
      this.cartService.removeFromCart(productId); // Remove from local storage
    }
    //console.log(orderitems);
  }

  get orderitems(): FormArray {
    return this.placeOrderForm.get('orderitems') as FormArray;
  }

  placeOrder(): void {
    const orderRequest = {
      addressId: this.placeOrderForm.value.address,
      orderitemRequests: this.placeOrderForm.value.orderitems
    };
    console.log('Order data:', orderRequest);
    this.checkout(orderRequest);
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
    this.removeOrderItem(id);
  }

  getCartItems(): Product[] {
    return this.cartService.getCartItems();
  }

  fetchAddresses(): void {
    this.addressService.fetchAddresses().subscribe({
      next: (address) => {
        this.addresses = address;
        console.log('Addresses:', this.addresses);
      },
      error: (err) => {
        console.error('Error fetching addresses:', err);
      }
    });
  }

  checkout(orderRequest: any): void {
    this.orderService.checkout(orderRequest).subscribe({
      next: (orderId) => {
        this.orderId = orderId;
        console.log('orderId:', this.orderId);
        this.checkoutMessage=this.orderService.checkoutMessage;
        console.log(this.checkoutMessage);
        if (orderId){
          this.goToOrderDetailPage(this.orderId);
          this.cartService.clearCart();
        }
      },
      error: (err) => {
        console.error('Error fetching addresses:', err);
      }
    });
  }

  goToProductPage(): void {
    this.routerService.goToProductPage();
  }

  goToOrderDetailPage(orderId: number): void {
    this.routerService.goToOrderDetailPage(orderId);
  }

  goToAddAddressPage(): void {
    this.routerService.goToAddAddressPage();
  }
}
