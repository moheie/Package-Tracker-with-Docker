import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderId: number | null = null;
  orderDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  ngOnInit(): void {
    // Retrieve orderId from route parameters
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));

      // Fetch order details from the service
      if (this.orderId) {
        this.orderService.getOrderById(this.orderId).subscribe(
          data => {
            this.orderDetails = data;
          },
          error => {
            console.error('Error fetching order details', error);
          }
        );
      }
    });
  }
}
