import { Component, Input, OnInit } from '@angular/core';
import { Set } from 'src/app/shared/models/set.model';

@Component({
  selector: 'app-set-lite',
  templateUrl: './set-lite.component.html',
  styleUrls: ['./set-lite.component.scss']
})
export class SetLiteComponent implements OnInit {
  @Input() set: Set;

  constructor() { }

  ngOnInit(): void {
  }

}
