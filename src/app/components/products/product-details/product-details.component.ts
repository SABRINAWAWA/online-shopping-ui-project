import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  productId: number = 0;
  product!: Product;
  addProductMessage!: string;
  userRole: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private routerSerivce: RouterService,
    private productService: ProductService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchProduct(this.productId);
    this.userRole = this.authService.getUserRole();
  }

  async fetchProduct(productId: number): Promise<void> {
    if (productId <= 0) {
      this.goToProductPage();
    } else {
      this.productService.fetchProduct(productId).subscribe({
        next: (product) => {
          this.product = product; // Assign the fetched orders to the component's orders array
          console.log('Order in component:', this.product); // Debugging log
        },
        error: (err) => {
          console.error('Error fetching order:', err); // Handle errors here
        }
      });
    }
  }

  async addToWatchList(productId: number): Promise<void> {
    if (productId <= 0) {
      this.goToProductPage();
    } else {
      this.productService.addToWatchList(productId).subscribe(
        message => {
          console.log(message);
          this.addProductMessage=this.productService.addProductMessage;  
          //this.fetchProduct(productId);   
        },
        error => {
          console.error('Error canceling order:', error);  // Handle error
        });
    }
  }

  async goToProductPage(): Promise<void> {
    await this.routerSerivce.goToProductPage();
  }
}
