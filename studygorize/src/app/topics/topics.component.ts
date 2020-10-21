import { Component, OnInit } from '@angular/core';
import { Topic } from '../shared/models/topic.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TopicService } from '../shared/services/topic.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  public topics: Topic[] = [];

  constructor(private topicService: TopicService) {
    topicService.getTopics().subscribe((topics) => {
      this.topics = topics;
    })
  }

  ngOnInit() {
  }

}
