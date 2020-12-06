import { IQuestion } from './question.model';
import { QuestionOption } from './questionOption.model';

export class FillInTheBlankQuestion implements IQuestion {
  constructor(
    public name: string,
    public answer: string,
    public userResponse: string
  ) {}

  isCorrect(): boolean {
    return this.userResponse.toLowerCase() === this.answer.toLowerCase();
  }
}