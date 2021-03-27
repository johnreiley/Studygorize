import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PartyConfig } from 'src/app/shared/models/party-models/partyConfig.model';
import { TestConfig } from 'src/app/shared/models/test-models/testConfig.model';
import { TopicOption } from 'src/app/shared/models/test-models/topicOption.model';
import { Topic } from 'src/app/shared/models/topic.model';

@Component({
  selector: 'app-party-options',
  templateUrl: './party-options.component.html',
  styleUrls: ['./party-options.component.scss']
})
export class PartyOptionsComponent implements OnInit {
  @Output() createParty = new EventEmitter<PartyConfig>();
  @Input() topics: Topic[];
  partyConfig: TestConfig = {
    shuffle: false, 
    questionCount: 25, 
    questionTimeLimit: 10,
    isMultiTopicTest: true,
    allowPrevousNavigation: false, 
    skipAttributesWithNoValue: true,
    includeShortAnswer: false, 
    includeMultipleChoice: true,
    topicOptions: []
  }

  showTopicOptionsError = false;
  showQuestionLimitError = false;
  showTimeLimitError = false;

  constructor() { }

  ngOnInit(): void {
    if (this.topics !== undefined) {
      this.topics.forEach(topic => {
        this.partyConfig.topicOptions.push({
          topicTitle: topic.title, topicId: topic.id, include: false
        });
        this.partyConfig.topicOptions.sort((t1, t2) => {
          return t1.topicTitle >= t2.topicTitle ? 1 : -1;
        })
      });
    }
  }

  onSubmit() {
    let isValid = true;
    // check if there are any topics selected
    if (!this.partyConfig.topicOptions.reduce((acc, option) => { return acc ? acc : option.include }, false)) {
      this.showTopicOptionsError = true;
      isValid = false;
    } else {
      this.showTopicOptionsError = false;
    }

    if (this.partyConfig.questionCount === undefined || isNaN(this.partyConfig.questionCount) || this.partyConfig.questionCount < 0) {
      this.showQuestionLimitError = true;
      isValid = false;
    } else {
      this.showQuestionLimitError = false;
    }

    if (this.partyConfig.questionTimeLimit === undefined || isNaN(this.partyConfig.questionCount) || 
        this.partyConfig.questionTimeLimit < 1 || this.partyConfig.questionTimeLimit > 999) {
      this.showTimeLimitError = true;
      isValid = false;
    } else {
      this.showTimeLimitError = false;
    }
    
    if (isValid) {
      this.createParty.next(this.partyConfig);
    }
  }

}
