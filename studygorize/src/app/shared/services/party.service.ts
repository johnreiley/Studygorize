import { stringify } from '@angular/compiler/src/util';
import { EventEmitter, Injectable, Output } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { PartyQuestionResult } from '../models/party-models/partyQuestionResult.model';
import { PartyState } from '../models/party-models/partyState.model';
import { PartyUser } from '../models/party-models/partyUser.model';
import { PartyQuestion } from '../models/party-models/partyQuestion.model';
import { Test } from '../models/test-models/test.model';
import { MultipleChoiceQuestion } from '../models/test-models/multipleChoiceQuestion.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  readonly responseRecieved = new Subject<{uuid: string, value: number}>();
  readonly partyCreated = new Subject<string>();
  readonly userJoined = new Subject<PartyUser>();
  readonly userLeft = new Subject<string>();
  
  private socket: Socket;
  private partyState: PartyState;
  // private users: PartyUser[];

  constructor() {
    this.socket = io('http://localhost:8080', { withCredentials: false }); 
    this.socket.on('partyCreated', (partyId: string) => {
      this.partyCreated.next(partyId);
      this.partyState = PartyState.WaitingRoom;
    });

    this.socket.on('userJoined', ({ uuid, name }) => {
      if (this.partyState === PartyState.WaitingRoom) {
        // this.users.push({ uuid, name, score: 0 });
        this.userJoined.next({ uuid, name, score: 0 });
      }
    });
    
    this.socket.on('userLeft', (uuid: string) => {
      this.userLeft.next(uuid);
    });

    this.socket.on('selectOption', ({ uuid, value }) => {
      if (this.partyState === PartyState.ShowOptions) {
        this.responseRecieved.next({uuid, value});
      }
    });
  }

  // CONSIDER MOVING PARTY STATE CHANGE CONTROL TO THE PARTY COMPONENT
  public setPartyState(state: PartyState) {
    this.partyState = state;
  }

  public createParty() {
    this.socket.emit('createParty');
  }

  public loadQuestion() {
    this.socket.emit('questionLoading');
    this.partyState = PartyState.QuestionLoading;
  }

  public sendOptions(count: number) {
    this.socket.emit('showOptions', count);
    this.partyState = PartyState.ShowOptions;
  }

  public sendQuestionResults(results: PartyQuestionResult[]) {
    results.forEach(result => {
      this.socket.emit('questionResult', { ...result });
    });
    this.partyState = PartyState.QuestionResult;
  }

  public sendPartyResults() {
    this.socket.emit('partyResults');
    this.partyState = PartyState.PartyResults;
  }

  public closeConnection() {
    // this.socket.disconnect();
    this.socket.close();
  }

  /**
   * Calculates the user's score for a question
   * @param timeLeft the time in miliseconds left on the question
   * @param totalTime the total time in miliseconds to answer the question
   * @returns the users score for the question
   */
  public calcScore(timeLeft: number, totalTime: number) {
    return Math.floor((timeLeft / totalTime) * 100);
  }

  public convert(test: Test): PartyQuestion[] {
    return test.questions.map((q: MultipleChoiceQuestion) => {
      return {
        name: q.name,
        answerIndex: q.options.indexOf(q.answer),
        options: q.options
      }
    });
  }
}
