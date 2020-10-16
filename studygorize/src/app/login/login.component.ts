import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgForm } from '@angular/forms';
import { LoadingService } from '../shared/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('form', { static: false }) loginForm: NgForm;
  warning: { email: boolean, password: boolean, output: string } = {email: false, password: false, output: ''};

  constructor(
    private authService: AuthenticationService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  onLogin() {
    if (this.loginForm.invalid) {
      if (this.loginForm.controls.email.invalid) {
        this.warning.output = 'Enter a valid email';
      } else if (this.loginForm.controls.password.invalid) {
        this.warning.output = 'Enter your password';
      } else {
        this.warning.output = '';
      }
      return;
    }
    this.loadingService.startLoading();
    this.authService
      .login('email',
        { email: this.loginForm.value.email, password: this.loginForm.value.password })
      .subscribe((response) => {
        this.loadingService.stopLoading();
        if (!response.success) {
          console.log(response.error.code);
          switch(response.error.code) {
            case "auth/user-not-found":
              this.warning.output = "There is no account associated with this email";
              break;
            case "auth/wrong-password":
              this.warning.output = "Password is incorrect"
              break;
            case "auth/too-many-requests":
              this.warning.output = "Password entered incorrectly too many times. Try again in a few minutes"
              break;
          }
        }
      })
  }


}
