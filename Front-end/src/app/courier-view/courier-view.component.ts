import {Component, OnInit} from '@angular/core';
import {OrderService} from "../services/order.service";

@Component({
  selector: 'app-courier-view',
  templateUrl: './courier-view.component.html',
  styleUrls: ['./courier-view.component.css']
})
export class CourierViewComponent implements OnInit {

  orders: any[] = [];
  errorMessage: string = '';

  constructor(private orderService: OrderService) {
    this.loadAssignedOrders();
  }

  ngOnInit(): void {
  }

  loadAssignedOrders(): void {
    this.orderService.getAssignedOrders().subscribe((data: any) => {
      this.orders = data;
    }, (error) => {
      this.errorMessage = "Error fetching orders";
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  acceptOrder(orderId: number): void {
    this.orderService.acceptOrder(orderId).subscribe((data: any) => {
      this.loadAssignedOrders();
    }, (error) => {
      this.errorMessage = "Error accepting order";
    });
  }

  declineOrder(orderId:number):void{
    this.orderService.declineOrder(orderId).subscribe((data: any) => {
      this.loadAssignedOrders();
    }, (error) => {
      this.errorMessage = "Error declining order";
    });
  }

}
