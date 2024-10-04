import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {
  productRequest!: Product;
  category: Category[] = [];
  addProductMessage: string = '';
  productId: number = 0;
  constructor(private route: ActivatedRoute, private routerService: RouterService, private productService: ProductService) { }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.productId)
    this.fetchCategory();
    this.fetchProduct(this.productId);
  }

  fetchCategory(): void {
    this.productService.fetchCategory().subscribe({
      next: (categories) => {
        this.category = categories;
        console.log('Categories:', this.category); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching order:', err); // Handle errors here
      }
    });
  }

  fetchProduct(productId: number): void {
    if (productId <= 0) {
      this.goToProductPage();
    } else {
      this.productService.fetchProduct(productId).subscribe({
        next: (product) => {
          this.productRequest = product; // Assign the fetched orders to the component's orders array
          console.log('Order in component:', this.productRequest); // Debugging log
        },
        error: (err) => {
          console.error('Error fetching order:', err); // Handle errors here
        }
      });
    }
  }

  updateProduct(): void {
    this.productService.updateProduct(this.productRequest).subscribe(
      message => {
        this.addProductMessage = "Product Succesfully Added. Redirecting to Product page!";
        setTimeout(() => {
          console.log("Redirecting to Product Page.")
          this.goToProductDetailPage();
        }, 1000);
      },
      error => {
        console.error('Error adding order:', error);  // Handle error
      }
    );
  }
  goToProductDetailPage(): void {
    this.routerService.goToProductDetailPage(this.productId);
  }

  goToProductPage(): void {
    this.routerService.goToProductPage();
  }
}
