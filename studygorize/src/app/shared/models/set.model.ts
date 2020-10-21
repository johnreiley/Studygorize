import { Attribute } from './attribute.model';
import { Category } from './category.model';

export class Set {
  constructor(
    public name: string,
    public tags: Category[],
    public attributes: Attribute[]
  ) {}
}