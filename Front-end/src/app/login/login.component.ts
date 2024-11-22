import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (res: any) => {
          if (res.role === 'admin') {
            this.router.navigate(['/home-admin']);
          }
          else if(res.role === 'courier') {
            this.router.navigate(['/home-courier']);
          }
          else {


            console.log('Logged in successfully!', res);
            this.router.navigate(['/home']);

          }

        },
        (error: any) => {
          this.error = error.error;
          console.error('Login error', error);
        }
      );
    }
  }
}
