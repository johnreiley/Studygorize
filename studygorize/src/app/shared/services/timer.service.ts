import { Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTime: number = 0;

  constructor() { }

  get milisecondsElapsed() {
    return Date.now() - this.startTime;
  }

  get secondsElapsed() {
    return Math.round((Date.now() - this.startTime) / 1000 * 100) / 100;
  }

  startTimer() {
    this.startTime = Date.now();
  }

  resetTimer() {
    if (this.startTime !== 0) {
      let totalTime = Date.now() - this.startTime;
      this.startTime = 0;
      return totalTime;
    } else {
      return 0;
    }
  }
}
