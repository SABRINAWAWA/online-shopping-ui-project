import { Component } from '@angular/core';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productRequest:Product=new Product();
  category:Category[]=[];
  addProductMessage:string='';
  constructor(private routerService:RouterService, private productService:ProductService) { }

  ngOnInit(): void {
    this.fetchCategory();
  }

  fetchCategory(){
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

  addProduct():void{
      this.productService.addProduct(this.productRequest).subscribe(
        message => {
          this.addProductMessage = "Product Succesfully Added. Redirecting to Product page!";
          setTimeout(() => {
            console.log("Redirecting to Product Page.")
            this.goToProductPage();
          }, 1000);
        },
        error => {
          console.error('Error adding order:', error);  // Handle error
        }
      );
  }

  goToProductPage():void{
    this.routerService.goToProductPage();
  }
}
