export class TestConfig {
  constructor(
    public shuffle: boolean,
    public questionCount: number,
    public allowPrevousNavigation: boolean,
    public skipAttributesWithNoValue: boolean,
    public includeShortAnswer: boolean,
    public includeMultipleChoice: boolean
  ) {}
}