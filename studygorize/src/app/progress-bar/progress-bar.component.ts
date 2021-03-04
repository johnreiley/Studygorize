import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() seconds = 0;
  @Output() progressDone = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.progressDone.emit();
    }, (this.seconds * 1000));
  }

  get duration() {
    return `${this.seconds}s`;
  }
}
