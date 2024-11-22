import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

 // admin
  getAllCouriers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/courier/viewall`,{headers: {
      Authorization: `Bearer ${token}`
      }
  });
}}
