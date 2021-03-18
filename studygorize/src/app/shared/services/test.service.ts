import { Injectable } from '@angular/core';
import { Attribute } from '../models/attribute.model';
import { Set } from '../models/set.model';
import { DictionaryAttribute } from '../models/test-models/dictionaryAttribute.model';
import { ShortAnswerQuestion } from '../models/test-models/shortAnswerQuestion.model';
import { IQuestion } from '../models/test-models/question.model';
import { Test } from '../models/test-models/test.model';
import { TestConfig } from '../models/test-models/testConfig.model';
import { Topic } from '../models/topic.model';
import { MultipleChoiceQuestion } from '../models/test-models/multipleChoiceQuestion.model';
import { cloneDeep } from 'lodash';
import { QuestionType } from '../models/test-models/questionType.model';
import { TypedQuestion } from '../models/test-models/typedQuestion.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() {}

  private generateQuestionName(setName: string, attributeName: string) {
    return `${setName} : ${attributeName}`;
  }

  private generateMultiTopicQuestionName(topicTitle: string, setName: string, attributeName: string) {
    return `${topicTitle} : ${setName} : ${attributeName}`;
  }

  // private generateQuestionsBase(topic: Topic, questionCount: number, attributeDictionary: any, callback: Function): IQuestion[] {
  //   let questions: IQuestion[] = [];
  //   let attribute: Attribute;

  //   for (let i = 0; i < questionCount; i++) {
  //     // randomly select which attribute to use
  //     do {
  //       attribute = topic.setTemplate[Math.floor(Math.random() * topic.setTemplate.length)];
  //     } while (attributeDictionary[attribute.id] === undefined);
  //     if (attributeDictionary[attribute.id].length === 0) {
  //       delete attributeDictionary[attribute.id];
  //     }
  //   }

  //   return questions;
  // }

  private generateShortAnswerQuestions(topic: Topic, questionCount: number, 
    attributeDictionary: any, useLongQuestionName: boolean): IQuestion[] {
    
    let questions: IQuestion[] = [];
    let attribute: Attribute;
    
    for (let i = 0; i < questionCount; i++) {
      // randomly select the attributes to be tested on
      do {
        attribute = topic.setTemplate[Math.floor(Math.random() * topic.setTemplate.length)];
      } while (attributeDictionary[attribute.id] === undefined);

      let answerAttribute = attributeDictionary[attribute.id]
        .splice(Math.floor(Math.random() * attributeDictionary[attribute.id].length), 1)[0];
      // don't count it if it's a blank string
      if (answerAttribute.attributeValue === '') {
        continue;
      }

      let questionName;
      if (useLongQuestionName) {
        questionName = this.generateMultiTopicQuestionName(topic.title, answerAttribute.setName, attribute.value);
      } else {
        questionName = this.generateQuestionName(answerAttribute.setName, attribute.value)
      }
      questions.push(new ShortAnswerQuestion(
        questionName,
        answerAttribute.attributeValue, 
        "")
      );
      
      if (attributeDictionary[attribute.id].length === 0) {
        delete attributeDictionary[attribute.id];
      }
    }

    return questions;
  }

  private generateMultipleChoiceQuestions(topic: Topic, questionCount: number, 
    attributeDictionary: any, useLongQuestionName: boolean): IQuestion[] {
    
    let questions: IQuestion[] = [];
    let attribute: Attribute;
    let optionsBankDictionary = cloneDeep(attributeDictionary);
    let setTemplate = cloneDeep(topic.setTemplate);

    // filter out attributes that don't have enough options
    for (let prop in optionsBankDictionary) {
      if (optionsBankDictionary[prop] !== undefined && this.distinct(optionsBankDictionary[prop]).length < 2) {
        let attribute = setTemplate.find(a => a.id.toString() === prop);
        setTemplate.splice(setTemplate.indexOf(attribute), 1);
        delete optionsBankDictionary[prop];
      }
    }

    console.log(attributeDictionary);
    console.log(optionsBankDictionary);

    for (let i = 0; i < questionCount; i++) {
      // randomly select which attribute to use
      do {
        attribute = setTemplate[Math.floor(Math.random() * setTemplate.length)];
      } while (attributeDictionary[attribute.id] === undefined || attributeDictionary[attribute.id].length === 0);

      // pick the answer
      let answerIndex = Math.floor(Math.random() * attributeDictionary[attribute.id].length);
      let answerAttribute: DictionaryAttribute = attributeDictionary[attribute.id]
        .splice(answerIndex, 1)[0];
      if (answerAttribute.attributeValue === '') {
        continue;
      }

      // generate the options
      let attributeArray: string[] = this.distinct([ ...optionsBankDictionary[attribute.id] ].map(da => da.attributeValue));
      attributeArray.splice(attributeArray.indexOf(answerAttribute.attributeValue), 1);
      attributeArray = this.shuffle(attributeArray).filter(a => a !== '');
      if (attributeArray.length === 0) {
        continue;
      }
      attributeArray = attributeArray.splice(0, (attributeArray.length > 3 ? 3 : attributeArray.length));
      let options = [answerAttribute.attributeValue, ...attributeArray];
      options = this.shuffle(options);

      let questionName;
      if (useLongQuestionName) {
        questionName = this.generateMultiTopicQuestionName(topic.title, answerAttribute.setName, attribute.value);
      } else {
        questionName = this.generateQuestionName(answerAttribute.setName, attribute.value)
      }
      questions.push(new MultipleChoiceQuestion(
        questionName,
        answerAttribute.attributeValue, 
        "", 
        options)); 

      if (attributeDictionary[attribute.id].length === 0) {
        delete attributeDictionary[attribute.id];
      }
    }

    return questions;
  }

  private generateAttributeDictionary(setTemplate: Attribute[], sets: Set[], config: TestConfig): any {
    let attributeDictionary = {};

    setTemplate.forEach(attribute => {
      if (attributeDictionary[attribute.id] === undefined) {
        attributeDictionary[attribute.id] = [];
      }
    });

    sets.forEach(set => {
      set.attributes.forEach((attribute, i) => {
        // find the corresponding property to add the attribute to
        (<Array<DictionaryAttribute>>attributeDictionary[setTemplate[i].id])
          .push({attributeValue: attribute.value, setName: set.name});
      })
    })

    setTemplate.forEach(attribute => {
      if (attributeDictionary[attribute.id] !== undefined && attributeDictionary[attribute.id].length === 0) {
        delete attributeDictionary[attribute.id];
      }
    })

    if (config.skipAttributesWithNoValue) {
      attributeDictionary = this.filterAttributesWithOneValue(attributeDictionary);
    }

    return attributeDictionary;
  }

  private getMaxQuestionCount(sets: Set[], skipAttributesWithNoValue: boolean): number {
    if (skipAttributesWithNoValue) {
      return sets.reduce((acc, curr) => {
        return acc + curr.attributes.filter(a => a.value !== "").length;
      }, 0);
    } else {
      return sets.reduce((acc, curr) => {
        return acc + curr.attributes.length;
      }, 0);
    }
  }

  private getMaxMultiChoiceQuestionCount(attributeDictionary: any): number {
    let total = 0;
    for (let prop in attributeDictionary) {
      if (attributeDictionary[prop] !== undefined && attributeDictionary[prop].length >= 2) {
        // use a dictionary to make a unique list of values to quantify
        let valueDictionary = {};
        <Array<DictionaryAttribute>>attributeDictionary[prop].forEach((value: DictionaryAttribute) => {
          valueDictionary[value.attributeValue] = "value"; // just need a string because we only care about the prop
        });
        let numValues = Object.keys(valueDictionary).length;
        if (numValues >= 2) {
          total += attributeDictionary[prop].length;
        }
      }
    }
    return total;
  }

  private filterAttributesWithNoValue(sets: Set[]): Set[] {
    return sets.map(set => {
      set.attributes = set.attributes.filter(a => a.value !== "");
      return set;
    });
  }
  
  private filterAttributesWithOneValue(attributeDictionary: any): any {
    for(let attributeId in attributeDictionary) {
      let numValues = (<Array<DictionaryAttribute>>attributeDictionary[attributeId])
        .filter(da => da.attributeValue !== "")
        .length;
      if (numValues < 2) {
        delete attributeDictionary[attributeId];
      }
    }
    return attributeDictionary;
  }

  private shuffle(array: any[]): any[] {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Sorts a list of typed questions by their type
   * @param questions 
   */
  private sortByQuestionType(questions: TypedQuestion[]): TypedQuestion[] {
    return questions.sort((q1, q2) => {
      if (q1.getQuestionType() >= q2.getQuestionType()) {
        return 1;
      } else {
        return -1
      }
    });
  }

  /**
   * returns a array of distinct elements
   * @param array of primitive types
   */
  private distinct(array: any[]): any[] {
    let dictionary = {};
    let distinctArray = [];

    array.forEach((el, i) => {
      if (typeof(el) !== "object" && typeof(el) !== "function") {
        dictionary[el] = el;
      } else {
        dictionary[`object-${i}`] = el;
      }
    });

    for (let prop in dictionary) {
      distinctArray.push(dictionary[prop]);
    }

    return distinctArray;
  }

  public generateTest(config: TestConfig, topic: Topic): Test {
    // create dictionary out of attributes {attribute1: [], attribute2: [], attribute3: []}
    let attributeDictionary = this.generateAttributeDictionary(topic.setTemplate, topic.sets, config);

    let questionTypeDiviser = 0;
    if (config.includeMultipleChoice) {
      questionTypeDiviser++;
    }
    if (config.includeShortAnswer) {
      questionTypeDiviser++;
    }
    if (questionTypeDiviser === 0) {
      return undefined;
    }

    // figure out the max number of questions
    let maxQuestionCount = this.getMaxQuestionCount(topic.sets, config.skipAttributesWithNoValue);
    let finalQuestionCount = maxQuestionCount;
    if (config.questionCount < maxQuestionCount && config.questionCount !== 0) {
      maxQuestionCount = config.questionCount;
    }

    // generate the questions
    let questions: IQuestion[] = [];
    if (config.includeMultipleChoice) {
      let multiChoiceQuestionCount = this.getMaxMultiChoiceQuestionCount(attributeDictionary);
      if (multiChoiceQuestionCount > maxQuestionCount / questionTypeDiviser) {
        multiChoiceQuestionCount = (maxQuestionCount / questionTypeDiviser);
      } else {
        questionTypeDiviser--;
        maxQuestionCount = maxQuestionCount - multiChoiceQuestionCount;
      }
      questions = questions.concat(this.generateMultipleChoiceQuestions(topic, multiChoiceQuestionCount, attributeDictionary, config.isMultiTopicTest));
    }
    if (config.includeShortAnswer) {
      let shortAnswerQuestionCount = Math.floor(maxQuestionCount / questionTypeDiviser);
      questions = questions.concat(this.generateShortAnswerQuestions(topic, shortAnswerQuestionCount, attributeDictionary, config.isMultiTopicTest));
    }

    // make sure there aren't more questions than expected because I'm paranoid
    questions.splice(finalQuestionCount);
    console.log(questions);
    return new Test(questions, undefined, undefined);
  }

  /**
   * Creates a single test for multiple topics
   * @param configTopicPair an object with config and topic property
   */
  public generateMultiTopicTest(config: TestConfig, topics: Topic[]): Test {
    let tests: Test[] = [];
    let configTopicPairs = this.generateConfigTopicPairs(config, topics);

    // generate test for each of the topics
    configTopicPairs.forEach(pair => {
      tests.push(this.generateTest(pair.config, pair.topic));
    });

    // combine all of the questions into one test
    let combinedTest = tests.reduce((acc: Test, test: Test) => {
      acc.questions = acc.questions.concat(...test.questions);
      return acc;
    }, new Test([], undefined, undefined));

    // shuffle the questions then sort by question type
    this.shuffle(combinedTest.questions);
    if (config.questionCount > 0) {
      combinedTest.questions = combinedTest.questions.slice(0, config.questionCount);
    }
    this.sortByQuestionType(<any[]>combinedTest.questions);

    return combinedTest;
  }

  /**
   * Creates an array of config topic pairs that can be used to generate multiple tests
   * @param config the config for all of the tests
   * @param topics the array of topics that will be used
   */
  public generateConfigTopicPairs(config: TestConfig, topics: Topic[]): { config: TestConfig; topic: Topic; }[] {
    return topics
      .filter(topic => config.topicOptions.find(option => option.topicId === topic.id && option.include) !== undefined)
      .map(topic => {
        return {
          config: config,
          topic: topic
        }
    });
  }

  /**
   * Grades a test by iterating over all of the questions and calculating
   * a percent based on the amount correct.
   * @param test the test to be graded
   */
  public gradeTest(test: Test): Test {
    test.grade = 100;

    test.totalCorrect = test.questions.reduce((acc, curr) => {
      if (curr.isCorrect()) {
        return acc + 1;
      }
      return acc;
    }, 0);

    test.grade = Math.round((test.totalCorrect / test.questions.length) * 100);

    return test;
  }
}
