import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from 'src/app/shared/models/topic.model';
import { Set } from 'src/app/shared/models/set.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-set-view',
  templateUrl: './set-view.component.html',
  styleUrls: ['./set-view.component.scss']
})
export class SetViewComponent implements OnInit {
  topic: Topic;
  set: Set;

  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToasterService,
    private loader: LoadingService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loader.startLoading();
    this.route.params.subscribe((params: Params) => {
      let topicId = params['id'];
      let setId = params['setId'];
      if (topicId && setId) {
        this.topicService.getTopic(topicId).subscribe(topic => {
          if (!topic) {
            this.toastService.generateToast("There was an error getting the set", 2000);
            this.router.navigate(['/topics' + `${topicId}`]);
          } else {
            this.set = topic.sets.find(s => s.id === setId);
            this.topic = topic;
            this.loader.stopLoading();
          }
        });
      }
    })
  }

}
