import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestConfig } from 'src/app/shared/models/test-models/testConfig.model';
import { Topic } from 'src/app/shared/models/topic.model';

@Component({
  selector: 'app-test-options',
  templateUrl: './test-options.component.html',
  styleUrls: ['./test-options.component.scss']
})
export class TestOptionsComponent implements OnInit {
  @Output() submitConfig = new EventEmitter<TestConfig>();
  @Input() topics: Topic[];
  testConfig: TestConfig = { 
    shuffle: false, 
    questionCount: 0, 
    questionTimeLimit: 0,
    isMultiTopicTest: false,
    allowPrevousNavigation: true, 
    skipAttributesWithNoValue: true, 
    includeShortAnswer: true, 
    includeMultipleChoice: true,
    topicOptions: []
  };
  showQuestionTypesError = false;
  showTopicOptionsError = false;

  constructor() { }

  ngOnInit(): void {
    if (this.topics !== undefined) {
      this.testConfig.isMultiTopicTest = true;
      this.topics.forEach(topic => {
        this.testConfig.topicOptions.push({
          topicTitle: topic.title, topicId: topic.id, include: false
        });
        this.testConfig.topicOptions.sort((t1, t2) => {
          return t1.topicTitle >= t2.topicTitle ? 1 : -1;
        })
      });
    }
  }

  onSubmit() {
    // check if at least one question type is selected
    let isValid = true;
    if (!this.testConfig.includeShortAnswer && !this.testConfig.includeMultipleChoice) {
      this.showQuestionTypesError = true;
      isValid = false;
    } else {
      this.showQuestionTypesError = false;
    }
    // check if there are any topics selected
    if (this.testConfig.isMultiTopicTest && 
        !this.testConfig.topicOptions.reduce((acc, option) => { return acc ? acc : option.include }, false)) {
      this.showTopicOptionsError = true;
      isValid = false;
    } else {
      this.showTopicOptionsError = false;
    }
    
    if (isValid) {
      this.submitConfig.next(this.testConfig);
    }
  }

}
