import { TopicOption } from "./topicOption.model";

export class TestConfig {
  constructor(
    public shuffle: boolean,
    public questionCount: number,
    public questionTimeLimit: number,
    public isMultiTopicTest: boolean,
    public allowPrevousNavigation: boolean,
    public skipAttributesWithNoValue: boolean,
    public includeShortAnswer: boolean,
    public includeMultipleChoice: boolean,
    public topicOptions: TopicOption[]
  ) {}
}