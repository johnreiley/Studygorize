import { stringify } from '@angular/compiler/src/util';
import { EventEmitter, Injectable, Output } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { PartyQuestionResult } from '../models/party-models/partyQuestionResult.model';
import { PartyState } from '../models/party-models/partyState.model';
import { PartyUser } from '../models/party-models/partyUser.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  readonly responseRecieved = new Subject<{uuid: string, value: number}>();
  readonly partyCreated = new Subject<string>();
  readonly userJoined = new Subject<PartyUser>();
  
  private socket: Socket;
  private partyState: PartyState;
  // private users: PartyUser[];

  constructor(/*private socket: Socket*/) {
    this.socket = io('http://localhost:8080', { withCredentials: false }); 
    // this.socket.fromEvent<string>('partyCreated').subscribe((partyId: string) => {
    this.socket.on('partyCreated', (partyId: string) => {
      this.partyCreated.next(partyId);
      this.partyState = PartyState.WaitingRoom;
    });

    // this.socket.fromEvent<{ uuid: string, name: string }>('userJoined').subscribe(({ uuid, name }) => {
    this.socket.on('userJoined', ({ uuid, name }) => {
      if (this.partyState === PartyState.WaitingRoom) {
        // this.users.push({ uuid, name, score: 0 });
        this.userJoined.next({ uuid, name, score: 0 });
      }
    });

    // this.socket.fromEvent<{ uuid: string, value: number }>('selectOption').subscribe(({ uuid, value }) => {
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
}
