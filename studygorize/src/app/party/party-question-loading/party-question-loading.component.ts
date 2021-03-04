import { Component, Input, OnInit } from '@angular/core';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';
import { IQuestion } from 'src/app/shared/models/test-models/question.model';

@Component({
  selector: 'app-party-question-loading',
  templateUrl: './party-question-loading.component.html',
  styleUrls: ['./party-question-loading.component.scss']
})
export class PartyQuestionLoadingComponent implements OnInit {
  @Input() question: MultipleChoiceQuestion;
  @Input() time: Number;

  constructor() { }

  ngOnInit(): void {
  }

}
