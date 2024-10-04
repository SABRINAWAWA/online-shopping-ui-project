import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit {
  @Input() watchlistProducts: Product[] = [];
  @Output() watchListChanged: EventEmitter<Product[]> = new EventEmitter<Product[]>();
  watchlistMessage: string = '';
  userRole: string | null = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchWatchlistProducts(); // Fetch watchlist products on init
    this.userRole = this.authService.getUserRole();
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
    this.productService.watchlist$.subscribe(products => {
      this.watchlistProducts = products; // Update watchlist products on change
    });
  }

  removeFromWatchlist(productId: number): void {
    this.productService.removeFromWatchlist(productId).subscribe(
      message => {
        console.log(message);
        this.watchlistMessage = this.productService.watchlistMessage;
        this.fetchWatchlistProducts();
        this.watchListChanged.emit(this.watchlistProducts);
      },
      error => {
        console.error('Error canceling order:', error);  // Handle error
      });
    //this.fetchWatchlistProducts();
  }
}
