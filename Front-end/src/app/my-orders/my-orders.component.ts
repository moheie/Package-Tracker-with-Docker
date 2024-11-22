import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = []; // Array to hold retrieved orders
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe(
      data => {
        this.successMessage = 'Order cancelled successfully';
        this.loadOrders();
      },
      error => {
        this.errorMessage = 'Error cancelling order';
        console.error('Error cancelling order', error);
      }
    );
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      data => {
        this.orders = data;
      },
      error => {
        this.errorMessage = 'Error fetching orders';
        console.error('Error fetching orders', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
