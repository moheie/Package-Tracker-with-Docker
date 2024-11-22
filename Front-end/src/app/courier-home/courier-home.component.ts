import { Component } from '@angular/core';

@Component({
  selector: 'app-courier-home',
  templateUrl: './courier-home.component.html',
  styleUrls: ['./courier-home.component.css']
})
export class CourierHomeComponent {

  constructor() { }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
