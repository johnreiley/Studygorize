import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = false;
  loadingChange = new Subject<{isLoading: boolean, message: string}>();

  constructor() { }

  // toggleLoading() {
  //   this.isLoading = !this.isLoading;
  //   this.loadingChange.next(this.isLoading);
  // }

  startLoading(message: string) {
    this.isLoading = true;
    this.loadingChange.next({isLoading: this.isLoading, message});
  }
  
  stopLoading() {
    this.isLoading = false;
    this.loadingChange.next({isLoading: this.isLoading, message: ''});
  }
}
