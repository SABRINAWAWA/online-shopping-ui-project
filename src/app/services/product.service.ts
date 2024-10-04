import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Category } from '../models/category';
import { CountProduct } from '../models/count-product';
import { Product } from '../models/product';
import { ProfitProduct } from '../models/profit-product';
import { RestockRequest } from '../models/restock-request';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Retrieve Product info
  products: Product[] = [];
  product: Product = new Product();
  addProductMessage: string = '';

  // Retrieve watchlist products 
  watchlistProducts: Product[] = [];
  watchlistMessage: string = '';

  // Retrieve categories
  categories: Category[] = [];

  // Retrieve products 
  freqProducts!: Product[];
  recentProducts!: Product[];
  profitProducts!: ProfitProduct[];
  popularProducts!: CountProduct[];

  private watchlistSubject = new BehaviorSubject<Product[]>([]); // Subject for watchlist updates
  watchlist$ = this.watchlistSubject.asObservable(); // Observable to expose

  private allProductUrl: string = "/products/all";
  private productUrl: string = "/products/";
  private newProductUrl: String = "/products/new";
  private updateProductUrl: string = "/products/update/";
  private lowStockProductUrl: string = "/products/low-stock";
  private restockProductUrl: string = "/products/restock";
  private watchlistProductUrl: string = "/watchlist/product/";
  private watchlistUrl: string = "/watchlist/products/all";

  private freqProductUrl: string = "/products/frequent/3";
  private recentProductUrl: string = "/products/recent/3";
  private profitProductUrl: string = "/products/profit/3";
  private popularProductUrl: string = "/products/popular/3";

  private categoryUrl: string = "/category/all";
  private filterUrl: string = "/products/filter/";
  private baseUrl: string = "http://localhost:8080";

  constructor(private routerService: RouterService, private http: HttpClient) { }

  // Watchlist products
  fetchWatchListProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.watchlistUrl}`;
    return this.http.get<{ success: boolean; message: string; data: Product[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch watchlist product info:', error);
        return throwError(error);
      })
    );
  }

  addToWatchList(productId: number): Observable<void> {
    if (productId == 0) {
      this.routerService.goToHomePage();
      return new Observable<void>();
    } else {
      const url = `${this.baseUrl}${this.watchlistProductUrl}${productId}`;
      return this.http.post<{ success: boolean; message: string; }>(url, {}).pipe(
        map(result => {
          this.addProductMessage = result.message;
          console.log(this.addProductMessage);
          this.fetchWatchListProducts();
        }),
        catchError(error => {
          console.error('Failed to add to watchlist:', error);
          return throwError(error);
        })
      );
    }
  }

  removeFromWatchlist(productId: number): Observable<void> {
    const url = `${this.baseUrl}${this.watchlistProductUrl}${productId}`;
    return this.http.delete<{ success: boolean; message: string; }>(url).pipe(
      map(result => {
        this.watchlistMessage = result.message;
        this.fetchWatchListProducts();
      }),
      catchError(error => {
        console.error('Failed to remove from watchlist:', error);
        return throwError(error);
      })
    );
  }

  // Products list
  fetchProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.allProductUrl}`;
    return this.http.get<{ success: boolean; message: string; data: Product[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch product info:', error);
        return throwError(error);
      })
    );
  }

  fetchLowStockProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.lowStockProductUrl}`;
    return this.http.get<{ data: Product[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch low stock products:', error);
        return throwError(error);
      })
    );
  }

  restockProducts(restockRequests: RestockRequest[]): Observable<void> {
    const request = { requestList: restockRequests };
    const url = `${this.baseUrl}${this.restockProductUrl}`;
    return this.http.post<{ message: string }>(url, request).pipe(
      map(result => {
        console.log(result);
      }),
      catchError(error => {
        console.error('Failed to restock product:', error);
        return throwError(error);
      })
    );
  }

  fetchProduct(productId: number): Observable<Product> {
    const url = `${this.baseUrl}${this.productUrl}${productId}`;
    return this.http.get<{ success: boolean; message: string; data: Product }>(url).pipe(
      tap(result => {
        if (result.success) {
          this.product = result.data;
          console.log(result.data);
        } else {
          console.error(result.message);
        }
      }),
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch product info:', error);
        return throwError(error);
      })
    );
  }

  fetchFrequentOrders(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.freqProductUrl}`;
    return this.http.get<{ success: boolean; message: string; data: Product[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch frequent products:', error);
        return throwError(error);
      })
    );
  }

  fetchRecentOrders(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.recentProductUrl}`;
    return this.http.get<{ success: boolean; message: string; data: Product[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch recent products:', error);
        return throwError(error);
      })
    );
  }

  fetchProfitOrders(): Observable<ProfitProduct[]> {
    const url = `${this.baseUrl}${this.profitProductUrl}`;
    return this.http.get<{ success: boolean; message: string; data: ProfitProduct[] }>(url).pipe(
      map(result =>  result.data),
      catchError(error => {
        console.error('Failed to fetch profit products:', error);
        return throwError(error);
      })
    );
  }

  fetchPopularOrders(): Observable<CountProduct[]> {
    const url = `${this.baseUrl}${this.popularProductUrl}`;
    return this.http.get<{ success: boolean; message: string; data: CountProduct[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to fetch popular products:', error);
        return throwError(error);
      })
    );
  }

  fetchCategory(): Observable<Category[]> {
    const url = `${this.baseUrl}${this.categoryUrl}`;
    return this.http.get<{ success: boolean; data: Category[] }>(url).pipe(
      map(result => result.data),
      catchError(error => {
        console.error('Failed to retrieve category info:', error);
        return throwError(error);
      })
    );
  }

  filterByCategory(categoryId: number): Observable<Product[]> {
      const url = `${this.baseUrl}${this.filterUrl}${categoryId}`;
      return this.http.get<{ success: boolean; data: Product[] }>(url).pipe(
        map(result =>result.data),
        catchError(error => {
          console.error('Failed to filter products:', error);
          return throwError(error);
        })
      );
    
  }
  addProduct(product: Product): Observable<void> {
    const url = `${this.baseUrl}${this.newProductUrl}`;
    return this.http.post<{ message: string }>(url, product).pipe(
      map(result => {
        console.log(result.message);
      }),
      catchError(error => {
        console.error('Failed to add product:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(product: Product): Observable<void> {
    const url = `${this.baseUrl}${this.updateProductUrl}${product.productId}`;
    return this.http.patch<{ message: string }>(url, product).pipe(
      map(result => {
        console.log(result.message);
      }),
      catchError(error => {
        console.error('Failed to update product:', error);
        return throwError(error);
      })
    );
  }
  /*
  async fetchWatchListProducts(): Promise<void> {
    const url = `${this.baseUrl}${this.watchlistUrl}`;
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
      //console.log(result.data);
      this.watchlistProducts = result.data;
      console.log(this.watchlistProducts);
      this.watchlistSubject.next(this.watchlistProducts);
    } catch (error) {
      console.error('Failed to fetch watchlist product info:', error);
    }
  }

  async removeFromWatchlist(productId: number): Promise<void> {
    const url = `${this.baseUrl}${this.watchlistProductUrl}${productId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      //console.log(result.data);
      this.watchlistMessage = result.message;
      console.log(this.watchlistMessage);
      await this.fetchWatchListProducts();
    } catch (error) {
      console.error('Failed to fetch watchlist product info:', error);
    }
  }

  async fetchProducts(): Promise<void> {

    const url = `${this.baseUrl}${this.allProductUrl}`;
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
      //console.log(result.data);
      this.products = result.data;
      console.log(this.products);
    } catch (error) {
      console.error('Failed to fetch product info:', error);
    }
  }

  async fetchLowStockProducts(): Promise<void> {

    const url = `${this.baseUrl}${this.lowStockProductUrl}`;
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
      //console.log(result.data);
      this.products = result.data;
      console.log(this.products);
    } catch (error) {
      console.error('Failed to fetch product info:', error);
    }
  }

  async restockProducts(restockRequests: RestockRequest[]): Promise<void> {
    const request = {
      "requestList": restockRequests
    };
    const url = `${this.baseUrl}${this.restockProductUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Failed to restock product:', error);
    }
  }

  async fetchProduct(productId: number): Promise<void> {
    if (productId == 0) {
      this.routerService.goToHomePage();
    } else {
      const url = `${this.baseUrl}${this.productUrl}${productId}`;
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
        //console.log(result.data);
        this.product = result.data;
        //console.log(this.product);
      } catch (error) {
        console.error('Failed to fetch product info:', error);
      }
    }
  }

  async addToWatchList(productId:number):Promise<void>{
    if (productId == 0) {
      this.routerService.goToHomePage();
    } else {
      const url = `${this.baseUrl}${this.watchlistProductUrl}${productId}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        //console.log(result.message);
        this.addProductMessage=result.message;
        await this.fetchWatchListProducts();
      } catch (error) {
        console.error('Failed to fetch product info:', error);
      }
    }
  }

  async fetchFrequentOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.freqProductUrl}`;
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
      this.freqProducts = result.data;
    } catch (error) {
      console.error('Failed to fetch Products:', error);
    }
  }

  async fetchRecentOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.recentProductUrl}`;
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
      this.recentProducts = result.data;
    } catch (error) {
      console.error('Failed to fetch Products:', error);
    }
  }

  async fetchProfitOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.profitProductUrl}`;
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
      this.profitProducts = result.data;
    } catch (error) {
      console.error('Failed to fetch Products:', error);
    }
  }

  async fetchPopularOrders(): Promise<void> {
    const url = `${this.baseUrl}${this.popularProductUrl}`;
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
      this.popularProducts = result.data;
    } catch (error) {
      console.error('Failed to fetch Products:', error);
    }
  }

  async fetchCategory(): Promise<void> {
    const url = `${this.baseUrl}${this.categoryUrl}`;
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
      const data = await response.json();
      if (data.success === true) {
        this.categories = data.data;
      }
      //console.log(this.categories);
    } catch (error) {
      console.error('Failed to retrieve category info:', error);
    }
  }

  async filterByCategory(categoryId: number): Promise<void> {
    if (categoryId === 0) {
      await this.fetchProducts();
    } else {
      const url = `${this.baseUrl}${this.filterUrl}${categoryId}`;
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
        const data = await response.json();
        if (data.success === true) {
          this.products = data.data;
        }
        //console.log(this.categories);
      } catch (error) {
        console.error('Failed to retrieve category info:', error);
      }
    }
  }

  async addProduct(productRequest:Product):Promise<any>{
    const url = `${this.baseUrl}${this.newProductUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productRequest)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Failed to Create address:', error);
    }
  }

  async updateProduct(productRequest:Product, productId:number):Promise<any>{
    const url = `${this.baseUrl}${this.updateProductUrl}${productId}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productRequest)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Failed to Create address:', error);
    }
  }*/
}
