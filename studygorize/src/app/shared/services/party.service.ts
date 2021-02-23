import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PartyUser } from '../models/partyUser.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private partyState: PartyState;
  private users: PartyUser[];

  constructor(private socket: Socket) { 
    // this.socket.fromEvent<{ uuid, name }>('userJoined').subscribe(({ uuid, name }) => {
    //   if (this.partyState === PartyState.WaitingRoom) {
    //     this.users.push({ uuid, name, score: 0 });
    //   }
    // });
  }

  public createParty() {
    // this.socket.emit('createParty');
  }




}
