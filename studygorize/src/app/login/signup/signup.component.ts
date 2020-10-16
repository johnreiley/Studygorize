import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('form', { static: false }) signupForm: NgForm;
  warning: string = '';

  constructor(
    private authService: AuthenticationService,
    private loadingService: LoadingService,
    private toasterService: ToasterService
    ) { }

  ngOnInit() {
  }

  onSignup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const passwordMsg = this.validatePassword(password);
    if (this.signupForm.invalid) {
      return;
    } else if (!this.validateEmail(email)) {
      this.warning = 'Enter a valid email';
      return;
    } else if (passwordMsg != 'ok') {
      this.setPasswordWarning(passwordMsg);
      return;
    }
    this.loadingService.startLoading();
    this.authService
      .register('email', 
        { email: email, password: password })
      .subscribe((response) => {
        this.loadingService.stopLoading();
        if (!response.success) {
          console.log(response.error.code);
        } else {
          this.toasterService.generateToast(`Account created successfully with email ${email}`, 4000);
        }
      })
  }

  validateEmail(email): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validatePassword(password): string {
    if (password.length < 6) {
      return "too_short";
   } else if (password.length > 50) {
      return "too_long";
   } else if (password.search(/\d/) == -1) {
      return "no_num";
   } else if (password.search(/[a-zA-Z]/) == -1) {
      return "no_letter";
   } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
      return "bad_char";
   }
   return "ok";
  }

  setPasswordWarning(warning) {
    if (warning === "too_short") {
      this.warning = "Password must be 8 or more characters"
   } else if (warning === "too_long") {
      this.warning = "Password is too long"
   } else if (warning === "no_num") {
      this.warning = "Password must contain a number"
   } else if (warning === "no_letter") {
      this.warning = "Password must contain a letter"
   } else if (warning === "bad_char") {
      this.warning = "Password contains an invalid character"
   } else {
      this.warning = null;
   }
  }

}
