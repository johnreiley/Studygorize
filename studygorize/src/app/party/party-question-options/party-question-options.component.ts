import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PartyQuestion } from 'src/app/shared/models/party-models/partyQuestion.model';
import { MultipleChoiceQuestion } from 'src/app/shared/models/test-models/multipleChoiceQuestion.model';

@Component({
  selector: 'app-party-question-options',
  templateUrl: './party-question-options.component.html',
  styleUrls: ['./party-question-options.component.scss']
})
export class PartyQuestionOptionsComponent implements OnInit, OnChanges {
  @Input() question: PartyQuestion;
  @Input() duration: number;
  @Input() responses: number[];
  @Output() showAnswer = new EventEmitter<void>();
  @Output() skipQuestion = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  revealAnswer: boolean = false;
  showResponses: boolean = false;
  optionDict = {};
  letters = [ 'A', 'B', 'C', 'D' ];
  refinedResponses: number[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.question.options.forEach((o, i) => {
      this.optionDict[i] = { option: i, isAnswer: i === this.question.answerIndex }
    });
    console.log(this.optionDict)
  }

  ngOnChanges() {
    if (this.duration === 0) {
      this.onReveal();
    }
  }

  onReveal() {
    if (!this.revealAnswer) {
      this.refinedResponses = this.responses.reduce((acc, curr) => {
        acc[curr]++;
        return acc;
      }, [0,0,0,0]).slice(0, this.question.options.length);
      console.log(this.refinedResponses);
      this.revealAnswer = true;
      this.showResponses = true;
      this.showAnswer.emit();
    }
  }

  onNext() {
    this.next.emit();
  }

  onSkip() {
    this.duration = 0;
    this.revealAnswer = true;
    this.skipQuestion.emit();
  }

}
