import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Topic } from 'src/app/shared/models/topic.model';
import { Set } from 'src/app/shared/models/set.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicModalDeleteComponent } from '../topic-modal-delete/topic-modal-delete.component';

@Component({
  selector: 'app-topic-view',
  templateUrl: './topic-view.component.html',
  styleUrls: ['./topic-view.component.scss']
})
export class TopicViewComponent implements OnInit {
  public topic: Topic;
  public isGridView = true;
  public toggleViewBtnTxt = "Table View";
  public toggleViewIcon = "table_view";

  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToasterService,
    private loader: LoadingService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.loader.startLoading('');
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      if (id) {
        this.topicService.getTopic(id).subscribe(topic => {
          if (!topic) {
            this.toastService.generateToast("There was an error getting the topic", 2000);
            this.router.navigate(['/topics']);
          } else {
            this.topic = topic;
            this.loader.stopLoading();
          }
        });
      }
    })
  }

  onDelete() {
    this.loader.startLoading('Deleting topic');
    this.topicService.deleteTopic(this.topic.id).subscribe(() => {
      this.router.navigate(['/topics']);
      this.loader.stopLoading();
      this.toastService.generateToast(`Deleted topic "${this.topic.title}"`, 3000);
    });
  }

  openModal() {
    const modalRef = this.modalService.open(TopicModalDeleteComponent);
    modalRef.componentInstance.entityType = "topic";
    modalRef.componentInstance.entityName = this.topic.title;
    modalRef.componentInstance.modalTitle = "Delete Topic";
    modalRef.componentInstance.modalMessage = "Deleting this topic will delete all of its sets.";
    
    modalRef.componentInstance.deleteEvent.subscribe(() => {
      this.onDelete();
    });
  }

  onToggleView() {
    this.isGridView = !this.isGridView;

    if (this.isGridView) {
      this.toggleViewBtnTxt = "Table View";
      this.toggleViewIcon = "table_view";
    } else {
      this.toggleViewBtnTxt = "Grid View";
      this.toggleViewIcon = "view_comfy";
    }
  }

}
