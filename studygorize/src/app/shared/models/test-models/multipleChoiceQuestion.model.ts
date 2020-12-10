import { IQuestion } from './question.model';
import { QuestionType } from './questionType.model';
import { TypedQuestion } from './typedQuestion.model';

export class MultipleChoiceQuestion extends TypedQuestion implements IQuestion {
  constructor(
    public name: string,
    public answer: string,
    public userResponse: string,
    public options: string[]
  ) {
    super(QuestionType.MultipleChoice);
  }

  isCorrect(): boolean {
    return this.userResponse === this.answer;
  }
}