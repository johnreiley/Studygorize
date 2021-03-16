import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyConfig } from '../shared/models/party-models/partyConfig.model';
import { PartyQuestion } from '../shared/models/party-models/partyQuestion.model';
import { PartyQuestionResult } from '../shared/models/party-models/partyQuestionResult.model';
import { PartyState } from '../shared/models/party-models/partyState.model';
import { PartyUser } from '../shared/models/party-models/partyUser.model';
import { MultipleChoiceQuestion } from '../shared/models/test-models/multipleChoiceQuestion.model';
import { Test } from '../shared/models/test-models/test.model';
import { TestConfig } from '../shared/models/test-models/testConfig.model';
import { Topic } from '../shared/models/topic.model';
import { LoadingService } from '../shared/services/loading.service';
import { PartyService } from '../shared/services/party.service';
import { TestService } from '../shared/services/test.service';
import { TimerService } from '../shared/services/timer.service';
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
  partyQuestions: PartyQuestion[] = [];
  questionResults: PartyQuestionResult[] = [];
  partyConfig: TestConfig;
  showQuestionCount: boolean = false;
  currentQuestionIndex: number = 0;
  showPartyId: boolean = false;
  questionDuration: number = 10;
  questionResponseCount: number = 0;
  questionResponses: number[] = [];
  private partyService: PartyService;
  private DEFAULT_QUESTION_DURATION: number = 10;

  constructor(private topicService: TopicService,
    private testService: TestService,
    private loadingService: LoadingService,
    private timerService: TimerService) { 
      this.partyService = new PartyService();
    }

  ngOnInit(): void {
    this.loadingService.startLoading('');
    this.partyState = PartyState.PartyOptions;
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
      if (this.users.length === 0 && this.partyState !== PartyState.WaitingRoom) {
        // this.endParty();
      }
    });

    this.partyService.responseRecieved.subscribe(({uuid, value}) => {
      // prepare a result for the user to receive
      if (this.partyState === PartyState.ShowOptions) {
        const timeLeft = this.questionDuration - this.timerService.secondsElapsed;
        let isCorrect = value == this.partyQuestions[this.currentQuestionIndex].answerIndex; 
        let score = 0; 
        if (isCorrect) {
          score = this.partyService.calcScore(timeLeft, this.questionDuration);
        }
        this.questionResults.push({
          uuid,
          isCorrect,
          score
        });
        this.questionResponses.push(value);
        if (this.questionResponses.length === this.users.length) {
          this.questionDuration = 0;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.partyService.closeConnection();
  }

  public get PartyState() {
    return PartyState;
  }

  createParty(partyConfig: TestConfig) {
    this.loadingService.startLoading('Creating party');
    
    let test = this.testService.generateMultiTopicTest(partyConfig, this.topics);
    this.partyQuestions = this.partyService.convert(test);

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
    if (this.users.length > 1) {
      this.showPartyId = true;
      this.showQuestionCount = true;
      this.partyState = PartyState.QuestionLoading;
      this.partyService.loadQuestion();
    }
  }

  showOptions() {
    let currQuestion = this.partyQuestions[this.currentQuestionIndex];
    this.partyService.sendOptions(currQuestion.options.length);
    this.partyState = PartyState.ShowOptions;
  }

  onShowResults() {
    this.partyState = PartyState.QuestionResult;
    // figure out which users haven't answered yet..
    let unanswered = this.users.filter(u => this.questionResults.find(r => r.uuid === u.uuid) === undefined);
    this.questionResults = this.questionResults.concat(
      unanswered.map((u) => {
        return {
          uuid: u.uuid,
          isCorrect: false,
          score: 0
        }
      })
    );
    this.partyService.sendQuestionResults([...this.questionResults]);
    // update the score of each user
    this.questionResults.forEach(q => {
      if (q.score !== 0) {
        let user = this.users.find(u => u.uuid === q.uuid);
        if (user !== undefined) {
          user.score += q.score;
        }
      }
    });
    this.questionResults = [];
  }

  onSkipQuestion() {
    this.partyState = PartyState.QuestionResult;
    this.questionResults = this.users.map((u) => {
      return {
        uuid: u.uuid,
        isCorrect: false,
        score: 0
      }
    });
    this.partyService.sendQuestionResults([...this.questionResults]);
    this.questionResults = [];
  }

  showScoreboard() {
    if (this.currentQuestionIndex < this.partyQuestions.length - 1) {
      this.questionResponses = [];
      this.partyState = PartyState.Scoreboard;
    } else {
      this.showPartyId = false;
      this.showQuestionCount = false;
      this.partyState = PartyState.PartyResults;
      this.partyService.sendPartyResults();
    }
  }
  
  loadNextQuestion() {
    this.questionDuration = this.DEFAULT_QUESTION_DURATION;
    this.currentQuestionIndex++;
    this.partyState = PartyState.QuestionLoading;
    this.partyService.loadQuestion();
  }

  endParty() {
    this.partyId = undefined;
    this.partyState = PartyState.PartyOptions;
    this.users = [];
    this.partyQuestions = [];
    this.questionResults = [];
    this.partyConfig = undefined;
    this.showQuestionCount = false;
    this.currentQuestionIndex = 0;
    this.showPartyId = false;
  }

}
