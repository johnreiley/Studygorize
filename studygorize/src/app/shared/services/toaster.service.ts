import { Injectable, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private body: HTMLElement;

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {
    this.body = document.querySelector('body');
  }

  /**
   * 
   * @param message The message to be displayed
   * @param duration The duration of the toast in milliseconds (1000 = 1 second)
   */
  generateToast(message: string, duration: number) {
    var toast = this.document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
    <div class="toast-body">
        ${message}
    </div>`;

    this.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('display-toast');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('display-toast');
      setTimeout(() => {
        this.body.removeChild(toast);
      }, 300)
    }, duration);

    toast.ontouchend =
      toast.onclick = () => {
        toast.classList.remove('display-toast');
      }
  }
}
