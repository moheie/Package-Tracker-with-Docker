import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backend-adhamishere-dev.apps.rm3.7wse.p1.openshiftapps.com';  // Define your backend API

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // save token in local storage
      return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
        tap((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );

  }

  signUp(name: string, email: string, password: string, phone: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, phone, role });
  }
}
