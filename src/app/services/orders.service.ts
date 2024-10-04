import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  orders: Order[] = [];
  order: Order = new Order();
  orderId: number = 0;
  totalProductSold: number = 0;
  totalCompletedOrders: number = 0;
  totalProfit: number = 0;
  checkoutMessage: string = '';

  private orderUrl: string = "/all";
  private cancelUrl: string = "/cancel";
  private completeUrl: string = "/complete";
  private productSoldUrl: string = "/total/sold";
  private totalOrderUrl: string = "/total/completed";
  private profitUrl: string = "/total/profit";
  private filterUrl: string = "/filterBy/";
  private baseUrl: string = "http://localhost:8080/orders";

  constructor(private http: HttpClient) { }

  fetchOrders(): Observable<Order[]> {
    const url = `${this.baseUrl}${this.orderUrl}`;
    return this.http.get<{ success: boolean; message: string; data: Order[] }>(url)
      .pipe(
        tap(result => {
          if (result.success) {
            this.orders = result.data;
            console.log(result.data);
          } else {
            console.error(result.message);
          }
        }),
        map(result => result.data)
      );
  }

  fetchOrder(productId: number): Observable<Order> {
    const url = `${this.baseUrl}/${productId}`;
    return this.http.get<{ success: boolean; message: string; data: Order }>(url)
      .pipe(
        tap(result => {
          if (result.success) {
            this.order = result.data;
            console.log(result.data);
          } else {
            console.error(result.message);
          }
        }),
        map(result => result.data)
      );
  }

  cancelOrder(orderId: number): Observable<string> {
    const url = `${this.baseUrl}/${orderId}${this.cancelUrl}`;

    return this.http.patch<{ success: boolean; message: string; data: Order }>(url, {}).pipe(
      tap(() => {
        console.log('Order canceled');
        //this.fetchOrders().subscribe();
      }),
      map(result => result.message)  // Extract message from response
    );
  }

  completeOrder(orderId: number): Observable<string> {
    const url = `${this.baseUrl}/${orderId}${this.completeUrl}`;
    return this.http.patch<{ success: boolean; message: string; data: Order }>(url, {})
      .pipe(
        tap(() => {
          console.log('Order completed');
          this.fetchOrders().subscribe();
          this.getTotalCompletedOrders().subscribe();
          this.getTotalProductSold().subscribe();
          this.getTotalProfit().subscribe();
        }),
        map(result => result.message)  // Extract message from response
      );
  }

  getTotalProductSold(): Observable<number> {
    const url = `${this.baseUrl}${this.productSoldUrl}`;
    return this.http.get<{ success: boolean; message: string; data: number }>(url)
      .pipe(
        tap(result => {
          if (result.success) {
            this.totalProductSold = result.data;
            console.log(result.data);
          } else {
            console.error(result.message);
          }
        }),
        map(result=> result.data)
      );
  }

  getTotalCompletedOrders(): Observable<number> {
    const url = `${this.baseUrl}${this.totalOrderUrl}`;
    return this.http.get<{ success: boolean; message: string; data: number }>(url)
      .pipe(
        tap(result => {
          if (result.success) {
            this.totalCompletedOrders = result.data;
            console.log(result.data);
          } else {
            console.error(result.message);
          }
        }),
        map(result=> result.data)
      );
  }

  getTotalProfit(): Observable<number> {
    const url = `${this.baseUrl}${this.profitUrl}`;
    return this.http.get<{ success: boolean; message: string; data: number }>(url)
      .pipe(
        tap(result => {
          if (result.success) {
            this.totalProfit = result.data;
            console.log(result.data);
          } else {
            console.error(result.message);
          }
        }),
        map(result=> result.data)
      );
  }

  filterByStatus(status: string): Observable<Order[]> {
    if (status === 'ALL') {
      return this.fetchOrders();
    } else {
      const url = `${this.baseUrl}${this.filterUrl}${status}`;
      return this.http.get<{ success: boolean; message: string; data: Order[] }>(url)
        .pipe(
          tap(result => {
            if (result.success) {
              this.orders = result.data;
              console.log(result.data);
            } else {
              console.error(result.message);
            }
          }),
          map(result => result.data)
        );
    }
  }

  checkout(orderRequest: any): Observable<number> {
    const url = `${this.baseUrl}`;
    return this.http.post<{ success: boolean; message: string; data: number }>(url, orderRequest)
      .pipe(
        tap(result => {
          if (result.success) {
            this.orderId = result.data;
            this.checkoutMessage = result.message;
          } else {
            this.checkoutMessage = result.message;
            console.error(result.message);
          }
        }),
        map(result=>result.data)
      );
  }

  /*
  async fetchOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.orderUrl}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.data);
      this.orders = result.data;
      //console.log(this.orders[0].profit);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async fetchOrder(productId:number): Promise<void> {
    const url = `${this.baseUrl}/${productId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.data);
      this.order = result.data;
      //console.log(this.orders[0].profit);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    const url = `${this.baseUrl}/${orderId}${this.cancelUrl}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.message);
      await this.fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  }

  async completeOrder(orderId: number): Promise<void> {
    const url = `${this.baseUrl}/${orderId}${this.completeUrl}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.message);
      await this.fetchOrders();
      await this.getTotalCompletedOrders();
      await this.getTotalProductSold();
      await this.getTotalProfit();
    } catch (error) {
      console.error('Failed to complete order:', error);
    }
  }

  async getTotalProductSold(): Promise<void> {
    const url = `${this.baseUrl}${this.productSoldUrl}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.data);
      this.totalProductSold = result.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async getTotalCompletedOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.totalOrderUrl}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.data);
      this.totalCompletedOrders = result.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async getTotalProfit(): Promise<void> {
    const url = `${this.baseUrl}${this.profitUrl}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.data);
      this.totalProfit = result.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async filterByStatus(status: string): Promise<void> {
    if (status === 'ALL') {
      await this.fetchOrders();
    } else {
      const url = `${this.baseUrl}${this.filterUrl}${status}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result.data);
        this.orders = result.data;
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    }
  }

  async checkout(orderRequest: any): Promise<any> {
    const url = `${this.baseUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderRequest)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      const success = result.success;
      const message=result.message;
      const orderId=result.data;
      this.orderId=orderId;
      this.checkoutMessage=message;
      return success;
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  }
  */
}
