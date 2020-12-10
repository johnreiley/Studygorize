import { IQuestion } from './question.model';
import { QuestionType } from './questionType.model';
import { TypedQuestion } from './typedQuestion.model';

export class ShortAnswerQuestion extends TypedQuestion implements IQuestion {
  constructor(
    public name: string,
    public answer: string,
    public userResponse: string
  ) {
    super(QuestionType.ShortAnswer);
  }

  isCorrect(): boolean {
    return this.userResponse.toLowerCase() === this.answer.toLowerCase();
  }
}