import { QuestionOption } from './questionOption.model';
import { QuestionType } from './questionType.model';

export interface IQuestion {
  name: string,
  answer: any,
  userResponse: any,
  isCorrect(): boolean
}