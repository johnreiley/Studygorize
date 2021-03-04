import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';
import { IQuestion } from 'src/app/shared/models/test-models/question.model';

@Component({
  selector: 'app-party-question-loading',
  templateUrl: './party-question-loading.component.html',
  styleUrls: ['./party-question-loading.component.scss']
})
export class PartyQuestionLoadingComponent implements OnInit {
  @Input() question: string;
  @Input() time: Number;
  @Output() showOptions = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onProgressDone() {
    this.showOptions.emit();
  }
}
