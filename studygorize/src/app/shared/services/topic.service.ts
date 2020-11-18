import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { Attribute } from '../models/attribute.model';
import { Set } from '../models/set.model';
import { Topic } from '../models/topic.model';
import { AuthenticationService } from './authentication.service';
import { FirebaseService } from './firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models/category.model';

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
        // this.topicCollectionRef.
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

  private fetchTopics(): Observable<Topic[]> {
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

  /**
   * Reduces the tags to a list with distinct ids
   */
  private removeDuplicateTagsById(tags: Category[]): Category[] {
    let temp = {};
    tags.forEach(tag => {
      temp[tag.id] = {...tag};
    });
    let distinctTags = [];
    for (let tagId in temp) {
      distinctTags.push(temp[tagId]);
    }
    return distinctTags.sort((t1, t2) => {
      return t1.name >= t2.name ? 1 : -1;
    });
  }

  /**
   * Reduces the tags to a list with distinct names
   */
  private removeDuplicateTagsByName(tags: Category[]): Category[] {
    let temp = {};
    tags.forEach(tag => {
      temp[tag.name] = tag;
    });
    let distinctTags = [];
    for (let tagName in temp) {
      distinctTags.push(temp[tagName]);
    }
    return distinctTags.sort((t1, t2) => {
      return t1.name >= t2.name ? 1 : -1;
    });
  }

  /**
   * Finds tags with matching names in setTags and updates
   * the ids with the id of the matching tag in allTags
   * @param setTags the list of tags for the set
   * @param allTags the lsit of tags from the topic
   */
  private updateTagIds(setTags: Category[], allTags: Category[]): Category[] {
    // determine if there is a tag already with the same name
    setTags.forEach(t1 => {
      let dupTag = allTags.find(t2 => t1.id === t2.id);
      if (dupTag) {
        // if so, give it the same id
        t1.id = dupTag.id;
      }
    });
    return setTags;
  }

  /**
   * Compiles all the tags across the sets and 
   * returns a distinct array of tags
   * @param topic 
   */
  private compileAllTags(topic: Topic): Category[] {
    let allTags: Category[] = [];
    topic.sets.forEach(set => {
      allTags.push(...set.tags);
    });
    console.log(allTags);
    return this.removeDuplicateTagsById(allTags);
  }

  public generateUuid(): string {
    return uuidv4();
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

  public saveTopic(topic: Topic): Observable<string> {
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

    // match up persisting template attributes with the id from the old template
    newTopic.setTemplate.forEach(attribute => {
      let match = oldTopic.setTemplate.find(a => a.value === attribute.value);
      if (match !== undefined) {
        attribute.id = match.id;
      }
    });

    // filter out attributes on each set that don't match up with an id in the template
    newTopic.sets.forEach(set => {
      set.attributes = set.attributes.filter(a1 => newTopic.setTemplate.find(a2 => a1.id === a2.id));
      while (set.attributes.length < newTopic.setTemplate.length) {
        set.attributes.push(new Attribute(0, ''));
      }
    });

    // make a copy of the sets so that we're not reading from attributes that have already been updated
    // because there is a possibility for duplicate ids to appear if reading and modifying from same place
    let newTopicSetsCopy: Set[] = JSON.parse(JSON.stringify(newTopic.sets));
    newTopic.sets = newTopic.sets.map(set => {
      set.attributes = [];
      return set;
    });

    // for each template attribute, update the id according to its order and update
    // id of the corresponding attribute in each set
    newTopic.setTemplate.forEach((tempAttr, i) => {
      newTopicSetsCopy.forEach(set => {
        let updatedAttribute = {...new Attribute(i + 1, set.attributes.find(a => a.id === tempAttr.id).value)};
        newTopic.sets.find(s => s.id === set.id).attributes.push(updatedAttribute);
      });
      tempAttr.id = i + 1;
    });

    console.log(newTopic);

    return new Observable<void>(observable => {
      this.topicCollectionRef.doc(newTopic.id).set({ ...newTopic })
        .then(() => {
          observable.next();
        });
    })
  }

  deleteTopic(id: string): Observable<void> {
    return new Observable<void>(observable => {
      this.topicCollectionRef.doc(id).delete()
        .then(() => {
          observable.next();
        })
        .catch(error => { console.log(error) })
    });
  }

  saveSet(topicId: string, set: Set): Observable<Topic> {
    return new Observable<Topic>(observable => {
      this.getTopic(topicId).subscribe((topic) => {
        topic.sets = topic.sets.map((set, i) => {
          set.id = (i + 1).toString();
          return set;
        });
        set.id = (topic.sets.length + 1).toString();
        set.attributes = set.attributes.map(a => { return { ...a } });
        set.tags = this.removeDuplicateTagsByName(this.updateTagIds(set.tags, topic.categories));
        topic.sets.push({ ...set });
        topic.categories = this.compileAllTags(topic);
        this.topicCollectionRef.doc(topic.id).set({ ...topic })
        .then(() => {
          observable.next();
        });
      });
    });
  }

  updateSet(topicId: string, oldSet: Set, newSet: Set) {
    return new Observable<void>(observable => {
      newSet.id = oldSet.id;
      this.getTopic(topicId).subscribe(topic => {
        newSet.attributes = newSet.attributes.map(a => { return { ...a } });
        newSet.tags = this.removeDuplicateTagsByName(this.updateTagIds(newSet.tags, topic.categories));
        topic.sets[topic.sets.indexOf(oldSet)] = { ...newSet };
        topic.categories = this.compileAllTags(topic);
        this.topicCollectionRef.doc(topicId).set({ ...topic })
        .then(() => {
          observable.next();
        })
      });
    });
  }

  deleteSet(topicId: string, setId: string) {
    return new Observable<void>(observable => {
      this.getTopic(topicId).subscribe(topic => {
        topic.sets = topic.sets.filter(s => s.id !== setId);
        this.topicCollectionRef.doc(topicId).set({ ...topic })
        .then(() => {
          observable.next();
        })
      });
    });
  }
}
