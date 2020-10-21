import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { AuthenticationService } from './authentication.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topics: Topic[] = [];
  private topicCollectionRef = null;
  private key: string = "topics";

  constructor(private firebaseService: FirebaseService,
    private authService: AuthenticationService) {
    this.topicCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);

    this.authService.authStateChange.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.topicCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);
      }
    })
  }

  public getTopics(): Observable<Topic[]> {
    return new Observable<Topic[]>((observable) => {
      let topics: Topic[] = [];
      this.topicCollectionRef.get().then((snapshot) => {
        snapshot.forEach(doc => {
          topics.push(doc.data());
        });
        observable.next(topics);
      });
    });
  }
}
