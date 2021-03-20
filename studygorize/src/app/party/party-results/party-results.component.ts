import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PartyUser } from 'src/app/shared/models/party-models/partyUser.model';
import { ConfettiService } from 'src/app/shared/services/confetti.service';

@Component({
  selector: 'app-party-results',
  templateUrl: './party-results.component.html',
  styleUrls: ['./party-results.component.scss']
})
export class PartyResultsComponent implements OnInit {
  @Input() users: PartyUser[] = [];
  @Output() newParty = new EventEmitter<void>();
  @Output() redoParty = new EventEmitter<void>();

  constructor(private confetti: ConfettiService,
    private router: Router) { }

  ngOnInit(): void {
    this.users = this.users.slice(0, 3).sort((a, b) => a.score > b.score ? -1 : 1);
    while(this.users.length < 3) {
      this.users.push({
        name: "",
        score: 0,
        uuid: ""
      });
    }
    setTimeout(() => {
      this.confetti.start(3000);
    }, 1000);
  }

  onNewParty() {
    this.newParty.emit();
    this.router.navigate(['topics']).then(() => {
      this.router.navigate(['topics', 'party']);
    });
  }

  onRedo() {
    this.redoParty.emit();
  }

}
