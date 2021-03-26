import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-scoreboard-label',
  templateUrl: './party-scoreboard-label.component.html',
  styleUrls: ['./party-scoreboard-label.component.scss']
})
export class PartyScoreboardLabelComponent implements OnInit {
  @Input() name: string;
  @Input() score: number;

  constructor() { }

  ngOnInit(): void {
  }

}
