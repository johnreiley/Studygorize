import { QuestionType } from './questionType.model';

export abstract class TypedQuestion {
  constructor(questionType: QuestionType) {
    this.questionType = questionType;
  }

  protected questionType: QuestionType

  getQuestionType(): QuestionType {
    return this.questionType;
  }
}