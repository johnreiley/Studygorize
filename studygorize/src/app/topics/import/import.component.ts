import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('csvInput') csvInput: ElementRef;
  isOpen = false;

  constructor(
    private topicService: TopicService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
  }

  onUpload() {
    if (this.csvInput.nativeElement.files[0]) {
      this.loadingService.startLoading();
      this.topicService.saveCsvAsTopic(this.csvInput.nativeElement.files[0]).subscribe((id) => {
        this.router.navigate(['/topics/' + id]);
        this.loadingService.stopLoading();
      });
    }
  }

  onToggleAccordian() {
    this.isOpen = !this.isOpen;
  }
}
