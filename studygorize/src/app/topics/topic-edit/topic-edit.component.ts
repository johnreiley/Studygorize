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
    private loader: LoadingService
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
    
    partialTopic.attributes = partialTopic.attributes.map((attribute, i) => {
      return {...new Attribute(i + 1, attribute.attribute)};
    });

    let topic = new Topic(
      '', Date.now(), 
      partialTopic.title, 
      partialTopic.description, 
      [], partialTopic.attributes, 
      [], false
    );
    
    this.loader.startLoading();

    if (this.isEditMode) {
      this.topicService.updateTopic(this.originalTopic, topic).subscribe(() => {
        this.router.navigate([`/topics/${topic.id}`]);
        this.loader.stopLoading();
        this.toastService.generateToast(`Updated topic "${topic.title}"`, 3000);
      })
    } else {
      this.topicService.saveTopic(topic).subscribe((id) => {
        this.router.navigate([`/topics/${id}`]);
        this.loader.stopLoading();
        this.toastService.generateToast(`Created new topic "${topic.title}"`, 3000);
      });
    }
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
}
