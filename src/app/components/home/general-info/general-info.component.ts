import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CountProduct } from '../../../models/count-product';
import { Product } from '../../../models/product';
import { ProfitProduct } from '../../../models/profit-product';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent {
  freqProducts!: Product[];
  recentProducts!: Product[];
  profitProducts!: ProfitProduct[];
  popularProducts!: CountProduct[];
  userRole: string | null = '';

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) { }

  @Output() productsEmitted = new EventEmitter<any[]>();
  sendLists() {
    this.productsEmitted.emit([this.freqProducts, this.recentProducts, this.profitProducts, this.popularProducts]);
  }

  async ngOnInit(): Promise<void> {
    this.userRole = this.authService.getCurrentUserRole();
    console.log(this.userRole);
    if (this.userRole === 'ADMIN') {
      await this.fetchProfitOrders();
      await this.fetchPopularOrders();
    } else {
      await this.fetchFrequentOrders();
      await this.fetchRecentOrders();
    }
  }

  async fetchFrequentOrders(): Promise<void> {
    this.productService.fetchFrequentOrders().subscribe({
      next: (freqProducts) => {
        this.freqProducts = freqProducts;
      },
      error: (err) => {
        console.error('Error fetching products:', err); // Handle errors here
      }
    });
  }

  async fetchRecentOrders(): Promise<void> {
    this.productService.fetchRecentOrders().subscribe({
      next: (recentProducts) => {
        this.recentProducts = recentProducts;
      },
      error: (err) => {
        console.error('Error fetching products:', err); // Handle errors here
      }
    });
  }

  async fetchProfitOrders(): Promise<void> {
    await this.productService.fetchProfitOrders().subscribe({
      next: (profitProducts) => {
        this.profitProducts = profitProducts;
      },
      error: (err) => {
        console.error('Error fetching products:', err); // Handle errors here
      }
    });
  }

  async fetchPopularOrders(): Promise<void> {
    await this.productService.fetchPopularOrders().subscribe({
      next: (popularProducts) => {
        this.popularProducts = popularProducts;
      },
      error: (err) => {
        console.error('Error fetching products:', err); // Handle errors here
      }
    });
  }
}
