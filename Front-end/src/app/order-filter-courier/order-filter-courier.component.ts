import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-order-filter-courier',
  templateUrl: './order-filter-courier.component.html',
  styleUrls: ['./order-filter-courier.component.css']
})
export class OrderFilterCourierComponent implements OnInit {
  orders: any[] = [];
  couriers: any[] = [];
  currentOrderIndex: number = 0;
  errorMessage: string = '';
  courierId: number = 0;

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadCouriers();
  }

  loadCouriers(): void {
    this.userService.getAllCouriers().subscribe(
      (data: any[]) => {
        this.couriers = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load couriers';
      }
    );
  }

  filterOrdersByCourier(): void {
    if (this.courierId) {
      this.orderService.getOrdersFiltered(this.courierId).subscribe(
        (data) => {
          this.orders = data;
          this.currentOrderIndex = 0;
        },
        (error) => {
          this.errorMessage = 'Failed to load orders';
        }
      );
    } else {
      this.errorMessage = 'Please select a courier';
    }
  }

  getCurrentOrder() {
    return this.orders[this.currentOrderIndex];
  }

  isOrdersEmpty(): boolean {
    return this.orders.length === 0;
  }

  previousOrder(): void {
    if (this.currentOrderIndex > 0) {
      this.currentOrderIndex--;
    }
  }

  nextOrder(): void {
    if (this.currentOrderIndex < this.orders.length - 1) {
      this.currentOrderIndex++;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe(
      (data) => {
        this.orders = this.orders.filter((order) => order.id !== orderId);
        this.currentOrderIndex = 0;
      },
      (error) => {
        this.errorMessage = 'Failed to cancel order';
      }
    );
  }
}
