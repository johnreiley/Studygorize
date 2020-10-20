import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  isLoading = true;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.loadingChange.subscribe(isLoading => {
        this.isLoading = isLoading;
    });
  }

}
