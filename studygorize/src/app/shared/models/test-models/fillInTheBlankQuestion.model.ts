import { IQuestion } from './question.model';
import { QuestionOption } from './questionOption.model';

export class FillInTheBlankQuestion implements IQuestion {
  constructor(
    public name: string,
    public answer: string
  ) {}

  isCorrect(value: any): boolean {
    return value === name;
  }
}