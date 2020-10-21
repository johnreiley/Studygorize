import { Component, Input, OnInit } from '@angular/core';
import { Topic } from 'src/app/shared/models/topic.model';

@Component({
  selector: 'app-topic-lite',
  templateUrl: './topic-lite.component.html',
  styleUrls: ['./topic-lite.component.scss']
})
export class TopicLiteComponent implements OnInit {
  @Input() topic: Topic;

  public numSets: number;
  public numAttributes: number;

  constructor() { }

  ngOnInit(): void {
    this.numSets = this.topic.sets.length;
    this.numAttributes = this.topic.setTemplate.length;
  }

}
