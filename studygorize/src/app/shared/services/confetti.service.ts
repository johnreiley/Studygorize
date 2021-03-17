import { Injectable } from '@angular/core';
import confetti from '../../../javascript/confetti.min.js';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  start(miliseconds: number) {
    confetti.start(miliseconds);
  }
}
