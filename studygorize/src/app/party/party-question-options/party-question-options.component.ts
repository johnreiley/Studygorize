import { Component, Input, OnInit } from '@angular/core';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';

@Component({
  selector: 'app-party-question-options',
  templateUrl: './party-question-options.component.html',
  styleUrls: ['./party-question-options.component.scss']
})
export class PartyQuestionOptionsComponent implements OnInit {
  @Input() question: MultipleChoiceQuestion;
  revealAnswer: boolean = false;
  optionDict = {};
  
  constructor() { }

  ngOnInit(): void {
    this.question.options.forEach((o, i) => {
      this.optionDict[i] = { option: i, isAnswer: o === this.question.answer }
    });
    console.log(this.optionDict)
  }

  onReveal() {
    console.log("REVEAL YOUR TRUE IDENTITY!")
    this.revealAnswer = true;
  }

}
