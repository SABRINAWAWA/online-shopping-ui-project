import { Address } from "./address";
import { OrderItem } from "./order-item";

export class Order {
    orderId:number=0;
    datePlaced:string='';
    orderStatus:string='';
    orderItemCount:number=0;
    subtotal:number=0;
    tax:number=0;
    profit:number=0;
    total:number=0;
    address!:Address;
    orderitems!:OrderItem[];
}
