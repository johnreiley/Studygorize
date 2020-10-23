import { Attribute } from './attribute.model';
import { Category } from './category.model';
import { Set } from './set.model';

export class Topic {
  constructor(
    public id: string,
    public date: number,
    public title: string,
    public description: string,
    public categories: Category[],
    public setTemplate: Attribute[],
    public sets: Set[],
    public isPublic: boolean
  ) {}
}