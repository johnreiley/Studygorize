import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyConfig } from '../shared/models/party-models/partyConfig.model';
import { PartyState } from '../shared/models/party-models/partyState.model';
import { PartyUser } from '../shared/models/party-models/partyUser.model';
import { MultipleChoiceQuestion } from '../shared/models/test-models/multipleChoiceQuestion.model';
import { Test } from '../shared/models/test-models/test.model';
import { TestConfig } from '../shared/models/test-models/testConfig.model';
import { Topic } from '../shared/models/topic.model';
import { LoadingService } from '../shared/services/loading.service';
import { PartyService } from '../shared/services/party.service';
import { TestService } from '../shared/services/test.service';
import { TopicService } from '../shared/services/topic.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit, OnDestroy {
  partyId: string;
  partyState: PartyState;
  users: PartyUser[] = [];
  topics: Topic[];
  test: Test;
  partyConfig: TestConfig;
  showQuestionCount: boolean = false;
  currentQuestionIndex: number = 0;
  showPartyId: boolean = false;
  private partyService: PartyService;

  constructor(private topicService: TopicService,
    private testService: TestService,
    private loadingService: LoadingService) { 
      this.partyService = new PartyService();
    }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.topicService.getTopics().subscribe((topics) => {
      this.topics = topics;
      this.loadingService.stopLoading();
    })

    this.partyService.userJoined.subscribe((user: PartyUser) => {
      this.users.push(user);
    })

    this.partyService.userLeft.subscribe((uuid: string) => {
      let user = this.users.find(u => u.uuid === uuid);
      let index = this.users.indexOf(user);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    });
  }

  ngOnDestroy(): void {
    this.partyService.closeConnection();
  }

  public get PartyState() {
    return PartyState;
  }

  createParty(partyConfig: TestConfig) {
    this.loadingService.startLoading();
    
    // generate the test here...
    this.test = this.testService.generateMultiTopicTest(partyConfig, this.topics);
    console.log("QUIZ: ", this.test);

    if (this.partyId === undefined) {
      let subscription = this.partyService.partyCreated.subscribe((partyId) => {
        this.partyId = partyId;
        subscription.unsubscribe();
        this.partyState = PartyState.WaitingRoom;
        this.loadingService.stopLoading();
      });
      this.partyService.createParty();
    }
  }

  startParty() {
    console.log('START PARTY!!!')
    if (this.users.length > 1) {
      this.showPartyId = true;
      this.showQuestionCount = true;
      this.partyState = PartyState.QuestionLoading;
      this.partyService.loadQuestion();
      // do more setup...
    }
  }

  showOptions() {
    let currQuestion = this.test.questions[this.currentQuestionIndex] as MultipleChoiceQuestion;
    this.partyService.sendOptions(currQuestion.options.length);
    this.partyState = PartyState.ShowOptions;
    // do stuff...
  }

  loadNextQuestion() {
    this.currentQuestionIndex++;
    this.partyState = PartyState.QuestionLoading;
    this.partyService.loadQuestion();
  }

}
