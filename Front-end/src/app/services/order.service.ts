import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getOrders(): Observable<any[]> {
    // add token from local storage to the request header
    const token = localStorage.getItem('token');
    console.log(token)
    return this.http.get<any[]>(`${this.apiUrl}/order/myorders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items`);
  }

  submitOrder(orderDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Order Details:', orderDetails);
    console.log('Token:', token);
    return this.http.post<any>(`${this.apiUrl}/order/create`, orderDetails, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getOrderById(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/order/view?id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  cancelOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.apiUrl}/order/delete?id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //admin view all orders
  getAllOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/order/viewall`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  //admin update order
  updateOrder(orderId: any, order: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/order/update?id=${orderId}`, order, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //admin assign order
  assignOrder(oid: number, cid: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/order/assign?oid=${oid}&cid=${cid}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //admin delete order
  deleteOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.apiUrl}/order/delete?id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //courier view assigned orders
  getAssignedOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/order/assigned`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  //courier update order status
  updateOrderStatus(orderId: number, status:string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/order/updatestatus?oid=${orderId}&status=${status}`,null ,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  acceptOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/order/accept?oid=${orderId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  declineOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/order/decline?oid=${orderId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //order filter by courier
  getOrdersFiltered(courierId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/order?courier_id=${courierId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

}
