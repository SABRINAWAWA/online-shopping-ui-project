import { Product } from "./product";

export class OrderItem {
    orderitemId:number=0;
    purchasedPrice:number=0;
    retailPrice:number=0;
    wholesalePrice:number=0;
    quantity:number=0;
    productName:string='';
    product!:Product;
}
