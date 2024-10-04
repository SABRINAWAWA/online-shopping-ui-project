import { Component } from '@angular/core';
import { CountProduct } from '../../../models/count-product';
import { Order } from '../../../models/order';
import { Product } from '../../../models/product';
import { ProfitProduct } from '../../../models/profit-product';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userRole: string = '';
  totalProductSold: number = 0;
  totalCompletedOrders: number = 0;
  totalProfit: number = 0;
  orders: Order[] = [];
  freqProducts!: Product[];
  recentProducts!: Product[];
  profitProducts!: ProfitProduct[];
  popularProducts!: CountProduct[];

  constructor(
    private routerService: RouterService,
    private authService: AuthService,
    private orderService: OrdersService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchOrders();
    this.userRole = this.authService.getCurrentUserRole() || '';
    console.log(this.userRole);
    if (this.userRole === 'ADMIN') {
      await this.getTotalProductSold();
      await this.getTotalCompletedOrders();
      await this.getTotalProfit();
    }
  }

  onProductsReceived(products: any[]) {
    this.freqProducts = products[0];
    this.recentProducts = products[1];
    this.profitProducts = products[2];
    this.popularProducts = products[3];
  }

  fetchOrders(): void {
    this.orderService.fetchOrders().subscribe({
      next: (orders) => {
        this.orders = orders; // Assign the fetched orders to the component's orders array
        console.log('Orders in component:', this.orders); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching orders:', err); // Handle errors here
      }
    });
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe(
      message => {
        console.log(message);  // Log the success message
        this.fetchOrders();    // Refresh the orders list after canceling
      },
      error => {
        console.error('Error canceling order:', error);  // Handle error
      }
    );
  }

  completeOrder(orderId: number): void {
    this.orderService.completeOrder(orderId).subscribe(
      message => {
        console.log(message);  // Log the success message
        this.fetchOrders();
        this.getTotalCompletedOrders(); 
        this.getTotalProductSold();
        this.getTotalProfit();
      },
      error => {
        console.error('Error completing order:', error);  // Handle error
      }
    )
  }

  getTotalProductSold(): void {
    this.orderService.getTotalProductSold().subscribe(
      {
        next: (totalProductSold) => {
          this.totalProductSold = totalProductSold;
        },
        error: (err) => {
          console.error('Error fetching totalProductSold:', err);
        }
      });
  }

  getTotalCompletedOrders(): void {
    this.orderService.getTotalCompletedOrders().subscribe(
      {
        next: (totalCompletedOrders) => {
          this.totalCompletedOrders = totalCompletedOrders;
        },
        error: (err) => {
          console.error('Error fetching totalCompletedOrders:', err);
        }
      });
  }

  getTotalProfit(): void {
    this.orderService.getTotalProfit().subscribe(
      {
        next: (totalProfit) => {
          this.totalProfit = totalProfit;
        },
        error: (err) => {
          console.error('Error fetching totalProfit:', err);
        }
      });
  }

  filterByStatus(status: string): void {
    this.orderService.filterByStatus(status).subscribe({
      next: (orders) => {
        this.orders = orders; // Assign the fetched orders to the component's orders array
        console.log('Orders in component:', this.orders); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching orders:', err); // Handle errors here
      }
    });
  }

  goToOrderDetailPage(orderId: number): void {
    this.routerService.goToOrderDetailPage(orderId);
  }
}
