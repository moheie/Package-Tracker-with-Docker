import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Ensure phone is 10 digits
      role: ['Seller', Validators.required]  // Default value is 'Seller'
    }, {
      validators: this.passwordMatchValidator  // Custom validator to match passwords
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { name, email, password, phone, role } = this.signUpForm.value;
      this.authService.signUp(name, email, password, phone, role).subscribe(
        (res: any) => {
          console.log('Sign up successful!', res);
          this.router.navigate(['/']);  // Redirect after successful sign-up
        },
        (error: any) => {
          this.error = error.error;
          console.log('Sign up error', error); 
        }
      );
    }
  }
}
