import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() message: string = '';
  isLoading = true;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.loadingChange.subscribe(({isLoading, message}) => {
        this.isLoading = isLoading;
        this.message = this.isLoading ? message : '';
    });
  }

}
