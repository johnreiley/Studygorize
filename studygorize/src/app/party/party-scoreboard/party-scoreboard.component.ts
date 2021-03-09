import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyUser } from 'src/app/shared/models/party-models/partyUser.model';

@Component({
  selector: 'app-party-scoreboard',
  templateUrl: './party-scoreboard.component.html',
  styleUrls: ['./party-scoreboard.component.scss']
})
export class PartyScoreboardComponent implements OnInit {
  @Output() next = new EventEmitter<void>();
  @Input() users: PartyUser[];

  constructor() { }

  ngOnInit(): void {
    this.users = this.users.sort((a, b) => a.score >= b.score ? -1 : 1).slice(0, 8);
  }

  onNext() {
    this.next.emit();
  }

}
