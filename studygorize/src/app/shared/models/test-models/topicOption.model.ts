import { AttributeOption } from "./attributeOption";

export class TopicOption {
  constructor(
    public topicTitle: string, 
    public topicId: string, 
    public include: boolean,
    public attributeOptions: AttributeOption[]
  ) {}
}