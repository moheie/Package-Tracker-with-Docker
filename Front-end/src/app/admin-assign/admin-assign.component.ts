import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-admin-assign',
  templateUrl: './admin-assign.component.html',
  styleUrls: ['./admin-assign.component.css']
})
export class AdminAssignComponent implements OnInit {
  orders: any[] = [];
  couriers: any[] = [];
  orderId: number = 0;
  courierId: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private orderService: OrderService, private userService: UserService,private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadCouriers();
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
    });
}
    assignOrder(orderId: number, courierId: number): void {
    this.orderService.assignOrder(orderId, courierId).subscribe(
      data => {
        this.successMessage = 'Order assigned successfully';
        this.loadOrders();
      },
      error => {
        this.errorMessage = 'Error assigning order';
        console.error('Error assigning order', error);
      }
    );
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

  loadCouriers(): void {
    this.userService.getAllCouriers().subscribe(
      data => {
        this.couriers = data;
      },
      error => {
        this.errorMessage = 'Error fetching couriers';
        console.error('Error fetching couriers', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
