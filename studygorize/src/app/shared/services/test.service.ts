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

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() {}

  private generateQuestionName(setName: string, attributeName: string) {
    return `${setName} : ${attributeName}`;
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

  private generateShortAnswerQuestions(topic: Topic, questionCount: number, attributeDictionary: any): IQuestion[] {
    let questions: IQuestion[] = [];
    let attribute: Attribute;

    console.log("SET TEMPLATE IN SAQG: ", topic.setTemplate);
    console.log("ATTRIBUTE DICTIONARY: ", attributeDictionary);
    let newAttributeDictionary = cloneDeep(attributeDictionary);

    for (let i = 0; i < questionCount; i++) {
      // randomly select the attributes to be tested on
      let tempCounter = 0;
      do {
        attribute = topic.setTemplate[Math.floor(Math.random() * topic.setTemplate.length)];
      } while (newAttributeDictionary[attribute.id] === undefined && tempCounter < 30);

      let answerAttribute: DictionaryAttribute = newAttributeDictionary[attribute.id]
        .splice(Math.floor(Math.random() * newAttributeDictionary[attribute.id].length), 1)[0];
      
      questions.push(new ShortAnswerQuestion(
        this.generateQuestionName(answerAttribute.setName, attribute.value), 
        answerAttribute.attributeValue, 
        "")
      );
      
      if (newAttributeDictionary[attribute.id].length === 0) {
        delete newAttributeDictionary[attribute.id];
      }
    }

    return questions;
  }

  private generateMultipleChoiceQuestions(topic: Topic, questionCount: number, attributeDictionary: any): IQuestion[] {
    let questions: IQuestion[] = [];
    let attribute: Attribute;
    let optionsBankDictionary = cloneDeep(attributeDictionary);

    // filter out attributes that don't have enough options
    for (let prop in attributeDictionary) {
      if (attributeDictionary[prop] !== undefined && attributeDictionary[prop].length < 2) {
        let attribute = topic.setTemplate.find(a => a.id.toString() === prop);
        topic.setTemplate.splice(topic.setTemplate.indexOf(attribute), 1);
        delete attributeDictionary[prop];
      }
    }

    for (let i = 0; i < questionCount; i++) {
      // randomly select which attribute to use
      do {
        attribute = topic.setTemplate[Math.floor(Math.random() * topic.setTemplate.length)];
      } while (attributeDictionary[attribute.id] === undefined);

      // pick the answer
      let answerIndex = Math.floor(Math.random() * attributeDictionary[attribute.id].length);
      let answerAttribute: DictionaryAttribute = attributeDictionary[attribute.id]
      .splice(answerIndex, 1)[0];

      // generate the options
      let attributeArray: string[] = [ ...optionsBankDictionary[attribute.id] ].map(da => da.attributeValue);
      attributeArray.splice(attributeArray.indexOf(answerAttribute.attributeValue), 1);
      attributeArray = this.shuffle(attributeArray);
      attributeArray = attributeArray.splice(0, (attributeArray.length > 3 ? 3 : attributeArray.length));
      let options = [answerAttribute.attributeValue, ...attributeArray];
      options = this.shuffle(options);

      questions.push(new MultipleChoiceQuestion(
        this.generateQuestionName(answerAttribute.setName, attribute.value),
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

    if (config.skipAttributesWithNoValue) {
      sets = this.filterAttributesWithNoValue(sets);
    }

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
          total += numValues;
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

  public generateTest(config: TestConfig, topic: Topic): Test {
    console.log("GENERATE TEST")
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
      questions = questions.concat(this.generateMultipleChoiceQuestions(topic, multiChoiceQuestionCount, attributeDictionary));
    }
    if (config.includeShortAnswer) {
      let shortAnswerQuestionCount = Math.floor(maxQuestionCount / questionTypeDiviser);
      questions = questions.concat(this.generateShortAnswerQuestions(topic, shortAnswerQuestionCount, attributeDictionary));
    }

    // make sure there aren't more questions than expected because I'm paranoid
    questions.splice(finalQuestionCount);
    return new Test(questions, undefined, undefined);
  }

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
