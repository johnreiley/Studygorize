import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Set } from '../../models/set.model';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-topic-table',
  templateUrl: './topic-table.component.html',
  styleUrls: ['./topic-table.component.scss']
})
export class TopicTableComponent implements OnInit, OnChanges {
  @Input() topic: Topic;
  @Input() isPreview: boolean;
  tags: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.topic !== undefined) {
      this.tags = this.topic.sets.map(s => {
        return s.tags.map(t => t.name).join(', ');
      });
    }
  }

}
