import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TimerService } from '../shared/services/timer.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {
  @Input() seconds = 0;
  @Output() progressDone = new EventEmitter<void>();
  duration: string = '0s';
  intervalId: any;
  timeoutId: any;
  timeLeft: number = 0;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.progressDone.emit();
    }, (this.seconds * 1000));

    this.timerService.startTimer();
  }

  ngOnChanges() {
    if (this.seconds === 0) {
      if (this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
        this.timerService.resetTimer();
      }
    }
    this.duration = `${this.seconds}s`;
  }
}
