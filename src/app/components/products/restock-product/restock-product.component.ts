import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-restock-product',
  templateUrl: './restock-product.component.html',
  styleUrls: ['./restock-product.component.scss']
})
export class RestockProductComponent implements OnInit {
  lowStockProducts: Product[] = [];
  restockForm: FormGroup;
  constructor(private fb: FormBuilder, private routerService: RouterService, private productService: ProductService) {
    this.restockForm = this.fb.group({
      restockItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchLowStockProducts();
  }

  fetchLowStockProducts(): void {
    this.productService.fetchLowStockProducts().subscribe({
      next: (product) => {
        this.lowStockProducts = product; // Assign the fetched orders to the component's orders array
        console.log('Products in component:', this.lowStockProducts); // Debugging log
        this.populateRestockItems();
      },
      error: (err) => {
        console.error('Error fetching order:', err); // Handle errors here
      }
    });
  }

  get restockItems(): FormArray {
    return this.restockForm.get('restockItems') as FormArray;
  }

  populateRestockItems(): void {
    this.lowStockProducts.forEach((product) => {
      const restockItemGroup = this.fb.group({
        productId: [product.productId, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      });
      this.restockItems.push(restockItemGroup);
    });
    console.log("Restock items:", this.lowStockProducts);
  }

  restockProducts(): void {
    const restockRequests = this.restockForm.value.restockItems;
    //console.log(restockRequests);
    this.productService.restockProducts(restockRequests).subscribe({
      next: (response) => {
        console.log('Products restocked successfully', response);
        this.goToProductPage(); // Navigate to product page after success
      },
      error: (err) => {
        console.error('Error restocking products:', err); // Handle the error
      }
    });
    this.goToProductPage();
  }

  goToProductPage(): void {
    this.routerService.goToProductPage();
  }
}
