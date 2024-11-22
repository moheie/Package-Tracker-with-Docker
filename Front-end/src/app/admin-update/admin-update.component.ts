import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from "../services/order.service";

@Component({
  selector: 'app-admin-update',
  templateUrl: './admin-update.component.html',
  styleUrls: ['./admin-update.component.css']
})
export class AdminUpdateComponent implements OnInit {
  // Order properties
  pickupLocation: string = '';
  dropoff_location: string = '';
  deliveryTime: string = '';
  selectedItems: any[] = [];
  items: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  orderId: number = 0;
  itemsMenu: any[] = [];
  status: string = '';
  availableStatuses = ['accepted','picked up', 'in transit', 'delivered'];
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      this.loadOrder();
    });

  }

  loadOrder(): void {
    this.orderService.getAllOrders().subscribe(
      data => {
        // find order by id
        let order = data.find((order) => order.id == this.orderId);
        if (order) {
          this.pickupLocation = order.pickup_location;
          this.dropoff_location = order.dropoff_location;
          this.deliveryTime = order.delivery_time;
          this.status = order.status;
         this.selectedItems = order.items.map((item: any) =>
            this.itemsMenu.find(menuItem => menuItem.id === item.id) || item);

        } else {
          this.errorMessage = 'Order not found';
        }
      },
      error => {
        this.errorMessage = 'Error fetching order';
        console.error('Error fetching order', error);
      }
    );
  }

  // Add a new item slot to selectedItems array for adding another item to the order
  addItem(): void {
    this.selectedItems.push({ id: null, name: '' }); // Adds a new item slot with an empty name
  }

  // Remove an item from selectedItems array based on index
  removeItem(index: number): void {
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  // Submit the updated order details
  submitOrder(): void {
    const updatedOrder = {
      pickup_location: this.pickupLocation,
      dropoff_location: this.dropoff_location,
      delivery_time: this.deliveryTime,
      items: this.selectedItems,
      status: this.status
    };
    // Call the service method to update the order
    this.orderService.updateOrder(this.orderId, updatedOrder).subscribe(
      response => {
        this.successMessage = 'Order updated successfully';
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Error updating order';
        this.successMessage = '';
        console.error('Error updating order', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  loadItems(): void {
    this.orderService.getItems().subscribe(
      data => {
        this.itemsMenu = data;
      },
      error => {
        console.error('Error fetching items', error);
      }
    );
  }
}
