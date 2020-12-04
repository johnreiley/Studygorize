import { QuestionOption } from './questionOption.model';

export interface IQuestion {
  name: string,
  isCorrect(value: any): boolean
}