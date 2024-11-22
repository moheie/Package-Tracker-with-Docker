import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-courier-update',
  templateUrl: './courier-update.component.html',
  styleUrls: ['./courier-update.component.css']
})
export class CourierUpdateComponent implements OnInit {
  availableStatuses = ['accepted','picked up', 'in transit', 'delivered'];
  status: string ="";
  orderId: number = 0;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private orderService: OrderService,private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
    });
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] || '';
    });
  }

  updateStatus() {
    this.orderService.updateOrderStatus(this.orderId, this.status).subscribe(
      (response) => {
        this.successMessage = 'Status updated successfully';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Failed to update status';
        this.successMessage = '';
      }
    );
  }
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
