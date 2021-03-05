import { Component, Input, OnInit } from '@angular/core';
import { PartyQuestion } from 'src/app/shared/models/party-models/partyQuestion.model';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';

@Component({
  selector: 'app-party-question-options',
  templateUrl: './party-question-options.component.html',
  styleUrls: ['./party-question-options.component.scss']
})
export class PartyQuestionOptionsComponent implements OnInit {
  @Input() question: PartyQuestion;
  revealAnswer: boolean = false;
  optionDict = {};
  
  constructor() { }

  ngOnInit(): void {
    this.question.options.forEach((o, i) => {
      this.optionDict[i] = { option: i, isAnswer: i === this.question.answerIndex }
    });
    console.log(this.optionDict)
  }

  onReveal() {
    this.revealAnswer = true;
  }

  onNext() {

  }

  onSkip() {
    this.revealAnswer = true;
  }

}
