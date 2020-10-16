import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = false;
  loadingChange = new Subject<boolean>();

  constructor() { }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.loadingChange.next(this.isLoading);
  }

  startLoading() {
    this.isLoading = true;
    this.loadingChange.next(this.isLoading);
  }
  
  stopLoading() {
    this.isLoading = false;
    this.loadingChange.next(this.isLoading);
  }
}
