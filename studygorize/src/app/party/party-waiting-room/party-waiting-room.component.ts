import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyUser } from 'src/app/shared/models/party-models/partyUser.model';

@Component({
  selector: 'app-party-waiting-room',
  templateUrl: './party-waiting-room.component.html',
  styleUrls: ['./party-waiting-room.component.scss']
})
export class PartyWaitingRoomComponent implements OnInit {
  @Input() partyId: string;
  @Input() users: PartyUser[] = [];
  @Output() startParty = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onStart() {
    this.startParty.emit();
  }

}
