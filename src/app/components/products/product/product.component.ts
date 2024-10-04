import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { RouterService } from '../../../services/router.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  addProductMessage: string = '';
  watchlistProducts: Product[] = [];
  watchlistMessage: string = '';
  userRole: string | null = '';

  constructor(
    private routerService: RouterService,
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchProducts();
    //this.fetchWatchlistProducts();
    this.fetchCategory();
    this.userRole = this.authService.getUserRole();
  }

  fetchCategory() {
    this.productService.fetchCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories:', this.categories); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching order:', err); // Handle errors here
      }
    });
  }

  fetchWatchlistProducts() {
    this.productService.fetchWatchListProducts().subscribe({
      next: (watchlistProducts) => {
        this.watchlistProducts = watchlistProducts;
        console.log('WatchList Product:', this.watchlistProducts); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching product:', err); // Handle errors here
      }
    });
  }

  fetchProducts() {
    this.productService.fetchProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Products:', this.products); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching products:', err); // Handle errors here
      }
    });
  }

   addToWatchList(productId: number): void {
    this.productService.addToWatchList(productId).subscribe(
      message => {
        console.log(message);
        this.addProductMessage = this.productService.addProductMessage;
        this.fetchWatchlistProducts();   
      },
      error => {
        console.error('Error canceling order:', error);  // Handle error
      });
  }

  filterByCategory(categoryId: number): void {
    if (categoryId === 0) {
      this.fetchProducts();
    } else {
      this.productService.filterByCategory(categoryId).subscribe({
        next: (products) => {
          this.products = products;
          console.log('Products:', this.products); // Debugging log
        },
        error: (err) => {
          console.error('Error fetching products:', err); // Handle errors here
        }
      });
    }
  }

  goToProductDetailPage(productId: number): void {
    this.routerService.goToProductDetailPage(productId);
  }

  goToUpdateProductPage(productId: number): void {
    this.routerService.goToUpdateProductPage(productId);
  }
  goToAddProductPage(): void {
    this.routerService.goToAddProductPage();
  }

  goToLowStockProductPage(): void {
    this.routerService.goToLowStockProductPage();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.addProductMessage = this.cartService.addProductMessage;
  }

  getCartItems() {
    this.cartService.getCartItems();
  }

  updateWatchList(products: Product[]): void {
    this.watchlistProducts = products; // Update the watch list
  }
}
