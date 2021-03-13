import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {
  @Input() seconds = 0;
  @Output() progressDone = new EventEmitter<void>();
  duration: string = '0s';

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.progressDone.emit();
    }, (this.seconds * 1000));
  }

  ngOnChanges() {
    this.duration = `${this.seconds}s`;
  }
}
