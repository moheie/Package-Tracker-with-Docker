import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.css']
})
export class OrdersAdminComponent implements OnInit {

  orders: any[] = [];
  currentOrderIndex: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  isOrdersEmpty(): boolean {
    return this.orders.length === 0;
  }
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(
      data => {
        this.orders = data;
      },
      error => {
        this.errorMessage = 'Error fetching orders';
        console.error('Error fetching orders', error);
      }
    );
  }

  nextOrder(): void {
    if (this.currentOrderIndex < this.orders.length - 1) {
      this.currentOrderIndex++;
    }
  }

  previousOrder(): void {
    if (this.currentOrderIndex > 0) {
      this.currentOrderIndex--;
    }
  }

  getCurrentOrder() {
    return this.orders[this.currentOrderIndex];
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
}
