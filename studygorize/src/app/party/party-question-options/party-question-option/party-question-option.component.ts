import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-question-option',
  templateUrl: './party-question-option.component.html',
  styleUrls: ['./party-question-option.component.scss']
})
export class PartyQuestionOptionComponent implements OnInit {
  @Input() index: number;
  @Input() option: string;
  @Input() isAnswer: boolean;
  @Input() reveal: boolean;
  letters = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
  }

  constructor() { }

  ngOnInit(): void {
  }

  get letter() {
    return this.letters[this.index];
  }
}
