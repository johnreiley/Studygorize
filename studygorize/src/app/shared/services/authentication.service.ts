import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { Observable, from as fromPromise, Subject, observable } from 'rxjs';
import { AuthMessage } from '../models/authMessage.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth: any;
  isLoggedIn: boolean;
  redirectUrl: string = '/topics';
  authStateChange = new Subject<boolean>();
  userState: any;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router) {
    this.auth = this.firebaseService.firebaseInstance.auth;
    const userState = localStorage.getItem('user');
    if (userState) {
      this.userState = JSON.parse(userState);
      this.isLoggedIn = true;
    }
    this.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userState = user;
        localStorage.setItem('user', JSON.stringify(this.userState));
        this.isLoggedIn = true;
        // this.router.navigate([this.redirectUrl]);
      } else {
        console.log('there is no user!')
        localStorage.removeItem('user');
        this.isLoggedIn = false;
      }
      this.authStateChange.next(this.isLoggedIn);
    })

  }

  // getAuthInstance() {
  //   return this.auth();
  // }
  getUid(): string {
    return this.userState.uid;
  }

  getIdToken(): Observable<string> {
    return new Observable<string>((observable) => {
      this.auth().currentUser.getIdToken()
        .then(idToken => observable.next(idToken))
        .catch(() => {})
    })
  }

  login(loginType: string, credentials: any): Observable<AuthMessage> {
    switch (loginType) {
      case 'email':
        return this.loginUserEmail(credentials.email, credentials.password);
        break;
      default:
        return new Observable<AuthMessage>((observer) => {
          observer.next({ success: false, error: {code: null, message: 'Invalid login type provided'} })
        });
    }
  }

  register(registrationType: string, credentials: any): Observable<AuthMessage> {
    switch (registrationType) {
      case 'email':
        return this.registerNewUserEmail(credentials.email, credentials.password);
        break;
      default:
        return new Observable<AuthMessage>((observer) => {
          observer.next({ success: false, error: {code: null, message: 'Invalid registration type provided'} })
        });
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.auth().signOut();
    // localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /**
   * @param email 
   * @param password 
   */
  private loginUserEmail(email: string, password: string): Observable<AuthMessage> {
    return new Observable<AuthMessage>(observable =>
      fromPromise(
        this.auth().signInWithEmailAndPassword(email, password)
      ).subscribe(
        (response: AuthMessage) => {
          const user = JSON.stringify(response);
          localStorage.setItem('user', user);
          this.router.navigate([this.redirectUrl]);
          observable.next({success: true, error: null});
        },
        (error) => {
          observable.next({success: false, error: error});
        }
      ));
  }

  private registerNewUserEmail(email: string, password: string): Observable<AuthMessage> {
    return new Observable<AuthMessage>(observable =>
      fromPromise(
        this.auth().createUserWithEmailAndPassword(email, password)
      ).subscribe(
        (response: AuthMessage) => {
          this.router.navigate([this.redirectUrl]);
          console.log(response);
          observable.next({success: true, error: null});
        },
        (error) => {
          observable.next({success: false, error: error});
        }
      ));
 }

}
