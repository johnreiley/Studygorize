import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent implements OnInit {
  @Input() attribute: string;
  @Input() answer: string;
  shouldShowAnswer = false;

  constructor() { }

  ngOnInit(): void {
  }

  onReveal() {
    this.shouldShowAnswer = true;
  }

}
