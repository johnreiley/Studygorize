import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Attribute } from 'src/app/shared/models/attribute.model';
import { Topic } from 'src/app/shared/models/topic.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent implements OnInit {
  topicForm: FormGroup;
  isEditMode = false;
  topic: Topic;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
    private toastService: ToasterService,
    private loader: LoadingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.initForm();
    })
  }

  onSave() {
    // do stuff
    if (this.topicForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      // update the topic
    } else {
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
      this.topicService.saveTopic(topic).subscribe(() => {
        this.router.navigate(['/topics']);
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
