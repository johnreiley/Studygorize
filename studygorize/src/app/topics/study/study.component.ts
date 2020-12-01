import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopicService } from 'src/app/shared/services/topic.service';
import { Set } from 'src/app/shared/models/set.model';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { Topic } from 'src/app/shared/models/topic.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  public sets: Set[];
  public topic: Topic;
  public currentSetIndex = 0;
  public isLast = false;
  public showFinalSelection = false;
  public topicObservable: Observable<Topic>;
  private topicId: string;


  constructor(
    private topicService: TopicService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.topicId = params['id'];
      if (this.topicId) {
        this.topicObservable = this.topicService.getTopic(this.topicId)
        this.topicObservable.subscribe((topic: Topic) => {
          this.sets = topic.sets;
          this.topic = topic;
        })
      } else {
        this.toaster.generateToast("An error occurred while retrieving the topic", 3000);
        this.router.navigate(['../']);
      }
    })
  }

  onNextSet(button: HTMLButtonElement) {
    button.blur();
    if (this.isLast) {
      this.showFinalSelection = true;
    } else {
      this.currentSetIndex++;
      if (this.currentSetIndex === this.sets.length - 1) {
        this.isLast = true;
      }
    }
    window.scrollTo(0, 0);
  }

  onPreviousSet(button: HTMLButtonElement) {
    button.blur();
    this.currentSetIndex--;
    window.scrollTo(0, 0);
  }

  onStudyAgain() {
    this.currentSetIndex = 0;
    this.isLast = false;
    this.showFinalSelection = false;
  }

}
