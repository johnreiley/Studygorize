import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TestConfig } from 'src/app/shared/models/test-models/testConfig.model';

@Component({
  selector: 'app-test-options',
  templateUrl: './test-options.component.html',
  styleUrls: ['./test-options.component.scss']
})
export class TestOptionsComponent implements OnInit {
  @Output() submitConfig = new EventEmitter<TestConfig>();
  testConfig: TestConfig = { 
    shuffle: false, 
    questionCount: 0, 
    allowPrevousNavigation: true, 
    skipAttributesWithNoValue: true, 
    includeShortAnswer: true, 
    includeMultipleChoice: true
  };
  showQuestionTypesError = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // check if at least one question type is selected
    let isValid = true;
    if (!this.testConfig.includeShortAnswer && !this.testConfig.includeMultipleChoice) {
      this.showQuestionTypesError = true;
      isValid = false;
    }
    
    if (isValid) {
      this.submitConfig.next(this.testConfig);
    }
  }

}
