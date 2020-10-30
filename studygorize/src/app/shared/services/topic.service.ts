import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attribute } from '../models/attribute.model';
import { Topic } from '../models/topic.model';
import { AuthenticationService } from './authentication.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topics: Topic[] = [];
  private topicCollectionRef = null;
  private unsubscribeRealTime: any;
  private key: string = "topics";

  constructor(private firebaseService: FirebaseService,
    private authService: AuthenticationService) {
    this.topicCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);

    this.authService.authStateChange.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn && this.unsubscribeRealTime) {
        this.unsubscribeRealTime();
      } else if (isLoggedIn) {
        this.topicCollectionRef = firebaseService.getCollectionReference(this.authService.getUid(), this.key);        
        this.unsubscribeRealTime = this.topicCollectionRef.onSnapshot((snapshot) => {
          let updatedTopics: Topic[] = [];
          snapshot.forEach(doc => {
            updatedTopics.push(doc.data());
          })
          this.topics = updatedTopics;
          localStorage.setItem(this.key, JSON.stringify(updatedTopics));
        })
      }
    })
  }

  private fetchTopics() {
    return new Observable<Topic[]>((observable) => {
      let topics: Topic[] = [];
      this.topicCollectionRef.get().then((snapshot) => {
        snapshot.forEach(doc => {
          topics.push(doc.data());
        });
        console.log(topics);
        observable.next(topics);
      });
    });
  }

  public getTopics(): Observable<Topic[]> {
    if (localStorage.getItem(this.key)) {
      return new Observable<Topic[]>((observable) => {
        observable.next(JSON.parse(localStorage.getItem(this.key)));
      });
    } else {
      return this.fetchTopics();
    }
  }

  public getTopic(id: string): Observable<Topic> {
    return new Observable<Topic>((observable) => {
      if (this.topics.length > 0) {
        observable.next(this.topics.find(r => r.id === id))
      } else {
        this.fetchTopics().subscribe((topics) => {
          observable.next(topics.find(r => r.id === id));
        })
      }
    });
  }

  public saveTopic(topic: Topic) {
    return new Observable<string>((observable) => {
      let topicId: string;
      this.topicCollectionRef.add({ ...topic })
        .then((topicRef: any) => {
          topicId = topicRef.id;
          topicRef.update({
            id: topicRef.id,
            date: Date.now()
          }).then(() => {
            observable.next(topicId);
          });
        });
    });
  }

  public updateTopic(oldTopic: Topic, newTopic: Topic) {
    newTopic.id = oldTopic.id;
    newTopic.sets = oldTopic.sets;
    newTopic.categories = oldTopic.categories;
    newTopic.isPublic = oldTopic.isPublic;

    newTopic.sets.map(set => {
      set.attributes = set.attributes
        // filter each set's attributes based on the new template attributes
        .filter(attribute => newTopic.setTemplate.find(a => a.value == attribute.value))
        // update the id of each attribute
        .map(attribute => {
          return new Attribute(
            attribute.id = newTopic.setTemplate.find(a => a.value == attribute.value).id,
            attribute.value
          );
        });
    });

    return new Observable<void>(observable => {
      this.topicCollectionRef.doc(newTopic.id).set({ ...newTopic })
        .then(() => {
          observable.next();
        });
    })
  }
}
