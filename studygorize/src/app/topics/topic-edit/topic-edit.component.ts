import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Attribute } from 'src/app/shared/models/attribute.model';
import { Topic } from 'src/app/shared/models/topic.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicModalDeleteComponent } from '../topic-modal-delete/topic-modal-delete.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent implements OnInit {
  id: string;
  topicForm: FormGroup;
  originalTopic: Topic;
  isEditMode = false;
  topic: Topic;
  topicObservable: Observable<Topic>;
  saveBtnTxt = "Create";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
    private toastService: ToasterService,
    private loader: LoadingService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.initForm();

      if (this.id) {
        this.isEditMode = true;
        this.saveBtnTxt = "Save";

        this.topicObservable = this.topicService
          .getTopic(this.id)
          .pipe(tap((topic) => {
            this.topicForm.patchValue(topic);
            let attributes = (<FormArray>this.topicForm.get('attributes'));
            attributes.clear();
            topic.setTemplate.forEach(attribute => {
              attributes.push(
                new FormGroup({'attribute': new FormControl(attribute.value, Validators.required)})
              );
            })
          }));
        this.topicObservable.subscribe((topic) => {
          this.originalTopic = topic;
          console.log(this.originalTopic);
          if (!this.originalTopic) {
            return;
          }
          this.topic = JSON.parse(JSON.stringify(this.originalTopic));
        })
      }
    })
  }

  onSave() {
    // do stuff
    if (this.topicForm.invalid) {
      return;
    }

    let partialTopic = this.topicForm.value;

    let topic = new Topic(
      '', Date.now(), 
      partialTopic.title, 
      partialTopic.description, 
      [], [], [], false
    );
    
    let message = this.isEditMode ? 'Applying changes' : 'Saving topic';
    this.loader.startLoading(message);

    if (this.isEditMode) {
      topic.setTemplate = partialTopic.attributes.map((attribute, i) => {
        return {...new Attribute(0, attribute.attribute)};
      });

      this.topicService.updateTopic(this.originalTopic, topic).subscribe(() => {
        this.router.navigate([`/topics/${topic.id}`]);
        this.loader.stopLoading();
        this.toastService.generateToast(`Updated topic "${topic.title}"`, 3000);
      })
    } else {
      topic.setTemplate = partialTopic.attributes.map((attribute, i) => {
        return {...new Attribute(i + 1, attribute.attribute)};
      });

      this.topicService.saveTopic(topic).subscribe((id) => {
        this.router.navigate([`/topics/${id}`]);
        this.loader.stopLoading();
        this.toastService.generateToast(`Created new topic "${topic.title}"`, 3000);
      });
    }
  }

  onDelete() {
    this.loader.startLoading('');
    this.topicService.deleteTopic(this.topic.id).subscribe(() => {
      this.router.navigate(['/topics']);
      this.loader.stopLoading();
      this.toastService.generateToast(`Deleted topic "${this.topic.title}"`, 3000);
    });
  }

  onAddAttributeField() {
    (<FormArray>this.topicForm.get('attributes')).push(
        new FormGroup({ 'attribute': new FormControl('', Validators.required) })
      );
  }

  onRemoveAttributeField(index) {
    // have to have at least 1 attribute
    if ((this.topicForm.get('attributes') as FormArray).length > 1)
    (<FormArray>this.topicForm.get('attributes')).removeAt(index);
  }

  initForm() {
    this.topicForm = new FormGroup({
      'title': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'attributes': new FormArray([
        new FormGroup({ 'attribute': new FormControl('', Validators.required) })
      ])
    });
  }

  get attributesControl() {
    return (<FormArray>this.topicForm.get('attributes')).controls;
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

  onDrop(event: CdkDragDrop<FormArray>) {
    let attributesFormArray = this.topicForm.get('attributes'); 
    let attributes = attributesFormArray.value;
    moveItemInArray(attributes, event.previousIndex, event.currentIndex);
    attributesFormArray.setValue(attributes);

    console.log(this.topicForm.value);
  }
}
