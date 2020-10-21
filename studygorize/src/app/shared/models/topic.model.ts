import { Attribute } from './attribute.model';
import { Set } from './set.model';

export class Topic {
  constructor(
    public id: string,
    public name: string,
    public categories: string[],
    public setTemplate: Attribute[],
    public sets: Set[]
  ) {}
}