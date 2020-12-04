import { Injectable } from '@angular/core';
import { Attribute } from '../models/attribute.model';
import { Set } from '../models/set.model';
import { DictionaryAttribute } from '../models/test-models/dictionaryAttribute.model';
import { FillInTheBlankQuestion } from '../models/test-models/fillInTheBlankQuestion.model';
import { IQuestion } from '../models/test-models/question.model';
import { Test } from '../models/test-models/test.model';
import { TestConfig } from '../models/test-models/testConfig.model';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  private generateFillInTheBlankQuestion(setName: string, attributeName: string, attributeValue: string, ): IQuestion {
    return new FillInTheBlankQuestion(`${setName} : ${attributeName}`, attributeValue);
  }

  private generateAttributeDictionary(setTemplate: Attribute[], sets: Set[]): any {
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

    return attributeDictionary;
  }

  private getMaxQuestionCount(sets: Set[], skipAttributesWithNoValue: boolean) {
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

  generateTest(config: TestConfig, topic: Topic): Test {
    // create dictionary out of attributes {attribute1: [], attribute2: [], attribute3: []}
    let attributeDictionary = this.generateAttributeDictionary(topic.setTemplate, topic.sets);

    // figure out the max number of questions
    let maxQuestions = this.getMaxQuestionCount(topic.sets, config.skipAttributesWithNoValue);
    // generate the questions
    let questions: IQuestion[] = [];
    let attribute: Attribute;
    for (let i = 0; i < config.questionCount && i < maxQuestions; i++) {
      // randomly select the attributes to be tested on
      do {
        attribute = topic.setTemplate[Math.floor(Math.random() * topic.setTemplate.length)];
      } while (attributeDictionary[attribute.id] === undefined);

      let dictionaryAttribute: DictionaryAttribute = attributeDictionary[attribute.id]
        .splice(Math.floor(Math.random() * attributeDictionary[attribute.id].length), 1)[0];
      
      questions.push(this.generateFillInTheBlankQuestion(dictionaryAttribute.setName, attribute.value, dictionaryAttribute.attributeValue));
      
      if (attributeDictionary[attribute.id].length === 0) {
        delete attributeDictionary[attribute.id];
      }
    }

    return new Test(questions, undefined);
  }

  gradeTest(test: Test, answers: any): Test {
    return test;
  }
}
