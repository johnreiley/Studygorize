import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Topic } from 'src/app/shared/models/topic.model';
import { Set } from 'src/app/shared/models/set.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-topic-view',
  templateUrl: './topic-view.component.html',
  styleUrls: ['./topic-view.component.scss']
})
export class TopicViewComponent implements OnInit {
  public topic: Topic;

  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private loadingSerivce: LoadingService) { }

  ngOnInit(): void {
    this.loadingSerivce.startLoading();
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      if (id) {
        this.topicService.getTopic(id).subscribe(topic => {
          if (!topic) {
            this.toasterService.generateToast("There was an error getting the topic", 2000);
            this.router.navigate(['/topics']);
          } else {
            this.topic = topic;
            this.loadingSerivce.stopLoading();
          }
        });
      }
    })
  }

}
