import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './shared/services/authentication.service';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'studygorize';
  showContent: boolean;
  showNavbar: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.authService.authStateChange.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.showContent = true;
        this.showNavbar = true;
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.showContent = true;
        this.showNavbar = false;
        this.router.navigate(['/login']);
      }
      this.loadingService.stopLoading();
    });
  }
}
