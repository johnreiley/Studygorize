import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Topic } from 'src/app/shared/models/topic.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('csvInput') csvInput: ElementRef;
  @ViewChild('form') fileForm: NgForm;
  topic: Topic;
  isOpen = false;
  alertText = "";
  showAlert = false;
  alertTextOptions = {
    noFile: "Oops! It looks like you haven't selected a file to upload.",
    badFormat: "It looks like your file isn't formatted correctly. It is most likely missing a \"Name\" column. Take a look at the instructions above and double check that everything looks good."
  }

  constructor(
    private topicService: TopicService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
  }

  onFileSelect() {
    if (this.csvInput.nativeElement.files[0]) {
      this.topicService.convertCsvToTopic(this.csvInput.nativeElement.files[0]).subscribe((topic) => {
        if (topic === undefined) {
          this.loadingService.stopLoading();
          this.alertText = this.alertTextOptions["badFormat"];
          this.showAlert = true;
        } else {
          this.showAlert = false;
          this.topic = topic;
        }
      });
    }
  }

  onToggleAccordian() {
    this.isOpen = !this.isOpen;
  }

  onSubmit() {
    if (this.fileForm.valid && this.csvInput.nativeElement.files[0]) {
      if (this.csvInput.nativeElement.files[0]) {
        this.loadingService.startLoading('Uploading file');
        this.topicService.saveCsvAsTopic(this.csvInput.nativeElement.files[0]).subscribe((id) => {
          if (id === undefined) {
            this.loadingService.stopLoading();
            this.alertText = this.alertTextOptions["badFormat"];
            this.showAlert = true;
          } else {
            this.showAlert = false;
            this.router.navigate(['/topics/' + id]);
            this.loadingService.stopLoading();
          }
        });
      }
    } else {
      this.alertText = this.alertTextOptions["noFile"];
      this.showAlert = true;
    }
  }
}
