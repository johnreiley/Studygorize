import { IQuestion } from './question.model';
import { TestConfig } from './testConfig.model';

export class Test {
  constructor(
    public questions: IQuestion[],
    public grade: number,
    public totalCorrect: number
  ) {}
}