import { LoginResponse, UserLogin, UserRegister } from '../../models/user';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  NgModule,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private useService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  mode: 'signup' | 'login' = 'signup';
  isSubmitting = false;
  submitted = false;

  userForm = this.formBuilder.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showSwalAlert(text: string, type: 'success' | 'error') {
    Swal.fire({
      title: type === 'success' ? 'Success!' : 'Oops!',
      text: text,
      icon: type,
      confirmButtonText: type === 'success' ? 'OK!' : 'Retry',
      background: '#F9F3EF',
      color: '#456882',
      confirmButtonColor: '#1B3C53',
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formData = this.userForm.value;
      if (this.mode === 'signup') {
        const user: UserRegister = {
          fullName: formData.fullname || '',
          emailId: formData.email || '',
          password: formData.password || '',
        };

        this.useService.registerUser(user).subscribe({
          next: (res) => {
            if (res.result) {
              this.showSwalAlert(res.message || 'Signup successful', 'success');
              this.resetForm();
              this.toggleMode('login');
            } else {
              this.showSwalAlert(res.message, 'error');
            }
            this.isSubmitting = false;
            this.resetForm();
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.showSwalAlert(err?.error?.message || 'Server error', 'error');

            this.isSubmitting = false;
            this.cdr.markForCheck();
          },
        });
      } else if (this.mode === 'login') {
        const user: UserLogin = {
          emailId: formData.email || '',
          password: formData.password || '',
        };
        console.log(user);
        this.useService.loginUser(user).subscribe({
          next: (res) => {
            if (res.result && res.data?.token) {
              localStorage.setItem('token', res.data.token);
              this.showSwalAlert(res.message || 'Login successful', 'success');
              this.router.navigate(['/dashboard']);
            } else {
              const msg = res.message || 'Invalid login response';
              this.showSwalAlert(msg, 'error');

              this.cdr.markForCheck();
            }
            this.isSubmitting = false;
          },
          error: (err) => {
            this.isSubmitting = false;
            let errorMessage =
              err.status === 401 ? 'Email / Password Incorrect' : 'Error';
            this.showSwalAlert(errorMessage, 'error');
            this.cdr.markForCheck();
            this.isSubmitting = false;
          },
        });
      }
    }
  }
  get fullname() {
    return this.userForm.get('fullname');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }

  errorMessage(type: string): string {
    switch (type) {
      case 'email':
        if (this.email?.hasError('required')) return 'You must enter email';
        if (this.email?.hasError('email')) return 'Not a valid email';
        break;
      case 'fullname':
        if (this.fullname?.hasError('required'))
          return 'You must enter fullname';
        break;
      case 'password':
        if (this.password?.hasError('required'))
          return 'You must enter password';
        if (this.password?.hasError('minlength'))
          return 'Password alteast 6 characters';

        break;
    }
    return '';
  }
  resetForm() {
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
  }

  toggleMode(newMode: 'signup' | 'login') {
    this.mode = newMode;

    if (newMode === 'signup') {
      this.fullname?.setValidators([Validators.required]);
      this.email?.setValidators([Validators.required]);
      this.password?.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    } else {
      this.fullname?.clearValidators();
      this.email?.setValidators([Validators.required]);
      this.password?.setValidators([Validators.required]);
    }
    this.fullname?.updateValueAndValidity();
    this.email?.updateValueAndValidity();
    this.password?.updateValueAndValidity();

    const currentEmail = this.email?.value || '';
    this.userForm.reset({
      email: newMode === 'login' ? currentEmail : '',
    });
    this.resetForm();
    this.cdr.markForCheck();
  }
}
