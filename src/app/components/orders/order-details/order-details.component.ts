import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../models/order';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderId: number = 0;
  order!: Order;
  userRole: string | null = '';
  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private orderService: OrdersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.userRole = this.authService.getUserRole();
    this.fetchOrder(this.orderId);
  }

  async fetchOrder(orderId: number): Promise<void> {
    if (orderId == 0) {
      this.goToHomePage();
    } else {
      this.orderService.fetchOrder(orderId).subscribe({
        next: (order) => {
          this.order = order; // Assign the fetched orders to the component's orders array
          console.log('Order in component:', this.order); // Debugging log
        },
        error: (err) => {
          console.error('Error fetching order:', err); // Handle errors here
        }
      });
    }
  }

  cancelOrder(orderId: number): void {
    if (orderId == 0) {
      this.goToHomePage();
    } else {
      this.orderService.cancelOrder(orderId).subscribe(
        message => {
          console.log(message);  // Log the success message
          this.fetchOrder(orderId);   // Refresh the orders list after canceling
        },
        error => {
          console.error('Error canceling order:', error);  // Handle error
        }
      );
    }
  }

  completeOrder(orderId: number): void {
    if (orderId == 0) {
      this.goToHomePage();
    } else {
      this.orderService.completeOrder(orderId).subscribe(
        message => {
          console.log(message);  // Log the success message
          this.fetchOrder(orderId);
        },
        error => {
          console.error('Error completing order:', error);  // Handle error
        }
      )
    }
  }

  async goToProductDetailPage(productId: number): Promise<void> {
    this.routerService.goToProductDetailPage(productId);
  }

  async goToHomePage(): Promise<void> {
    this.routerService.goToHomePage();
  }
}
