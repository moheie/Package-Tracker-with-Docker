import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private apiUrl = 'https://backend-moheie-dev.apps.rm2.thpm.p1.openshiftapps.com';

  constructor(private http: HttpClient) {}

 // admin
  getAllCouriers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/courier/viewall`,{headers: {
      Authorization: `Bearer ${token}`
      }
  });
}}
