import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShortAnswerQuestion } from 'src/app/shared/models/test-models/shortAnswerQuestion.model';

@Component({
  selector: 'app-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss']
})
export class ShortAnswerQuestionComponent implements OnInit {
  @Input() index: number;
  @Input() question: ShortAnswerQuestion;
  @Input() response: string;
  @Output() onChangeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onChange() {    
    this.onChangeEvent.next(this.response);
  }
}
