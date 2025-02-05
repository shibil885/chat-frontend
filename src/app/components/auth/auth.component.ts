import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  confirmPasswordValidator,
  lowerCase,
  noDigit,
  specialChar,
  upperCase,
} from '../../validators/password.validator';
import {
  endWithSpace,
  invalidChar,
  letterOrNumber,
} from '../../validators/username.validator';
import { UserService } from '../../shared/services/user/user.service';
import { IUser } from '../../model/user/user.model';
import { Router } from '@angular/router';
// import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLogin = true;
  isOtp = false;
  isLoading = false;
  email = '';
  loginForm: FormGroup;
  signupForm: FormGroup;
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            invalidChar,
            letterOrNumber,
            endWithSpace,
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            upperCase,
            lowerCase,
            noDigit,
            specialChar,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.otpForm = this.fb.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.isLogin = false;
      this._userService.userLogin<IUser>(this.loginForm.value).subscribe(
        (res) => {
          if (res.success && res.meta) {
            this.isLoading = false;
            localStorage.setItem('acc_T', res.meta['access_token'].toString());
            this._router.navigate(['/home']);
          }
        },
        () => {
          this.isLoading = false;
          this.isLogin = true;
        }
      );
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { email, username, password } = this.signupForm.value;
      this._userService
        .userSignup<IUser>({ username, email, password })
        .subscribe(
          (res) => {
            if (res.success && res.data) {
              this.isLoading = false;
              this.isLogin = false;
              this.isOtp = true; 
              this.email = res.data?.email;
            }
          },
          () => {
            this.isLoading = false;
            this.isLogin = false;
          }
        );
    }
  }
  onOtpSubmit() {
    if (this.signupForm.valid) {
      this.isOtp = false;
      this.isLoading = true;
      this._userService
        .otpSubmit<IUser>({
          email: this.email,
          ...this.otpForm.value,
        })
        .subscribe(
          (res) => {
            if (res.success && res.meta) {  
              this.isLoading = false;
              localStorage.setItem('acc_T', res.meta['access_token'].toString());
              this._router.navigate(['/home']);
            }
          },
          () => {
            this.isLoading = false;
            this.isOtp = true;
          }
        );
    }
  }

  onResendOtp() {
    if (this.signupForm.valid) {
      console.log('Signup:', this.signupForm.value);
      // TODO
    }
  }
}
