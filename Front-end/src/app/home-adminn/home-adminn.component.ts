import { Component } from '@angular/core';

@Component({
  selector: 'app-home-adminn',
  templateUrl: './home-adminn.component.html',
  styleUrls: ['./home-adminn.component.css']
})
export class HomeAdminnComponent {


  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

}
