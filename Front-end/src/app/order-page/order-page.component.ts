import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {
  orders: any[] = [];
  pickupLocation: string = '';
  deliveryLocation: string = '';
  deliveryTime: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  items: any[] = [];
  selectedItems: any[] = [{}];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadOrders();
  }

  loadItems(): void {
    this.orderService.getItems().subscribe(
      data => {
        this.items = data;
      },
      error => {
        console.error('Error fetching items', error);
      }
    );
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      data => {
        this.orders = data;
        console.log('Orders:', this.orders);
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  addItem(): void {
    this.selectedItems.push({});
  }

  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }

  submitOrder(): void {
    if (this.pickupLocation && this.deliveryLocation && this.deliveryTime) {
      const orderDetails = {
        pickup_location: this.pickupLocation,
        dropoff_location: this.deliveryLocation,
        delivery_time: this.deliveryTime,
        items: this.selectedItems
      };

      console.log('Order Submitted:', orderDetails);

      this.orderService.submitOrder(orderDetails).subscribe(
        response => {
          console.log('Order successfully submitted', response);
          this.successMessage = 'Order added successfully!';
          this.errorMessage = '';

          this.pickupLocation = '';
          this.deliveryLocation = '';
          this.deliveryTime = '';
          this.selectedItems = [{}];
        },
        error => {
          console.error('Error submitting order', error);
          this.errorMessage = 'Failed to submit the order. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }
}
