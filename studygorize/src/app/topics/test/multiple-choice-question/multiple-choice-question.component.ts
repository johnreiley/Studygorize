import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';

@Component({
  selector: 'app-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss']
})
export class MultipleChoiceQuestionComponent implements OnInit {
  @Input() index: number;
  @Input() question: MultipleChoiceQuestion;
  @Input() radioSelected: string;
  @Output() onChangeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onChange() {
    this.onChangeEvent.next(this.radioSelected);
  }
}
