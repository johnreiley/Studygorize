import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logCollectionRef = null;
  private key = "logs";

  constructor(private firebaseService: FirebaseService, 
    private authService: AuthenticationService) { 
    this.logCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);

    this.authService.authStateChange.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.logCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);
      }
    })
  }

  public log(message: string): Observable<void> {
    return new Observable<void>((observable) => {
      this.logCollectionRef.add(message)
        .then(() => {
          observable.next();
        });
    });
  }
}
