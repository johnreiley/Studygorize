import { QuestionOption } from './questionOption.model';

export interface IQuestion {
  name: string,
  answer: any,
  userResponse: any,
  isCorrect(): boolean
}