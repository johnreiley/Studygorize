import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Topic } from 'src/app/shared/models/topic.model';
import { Set } from 'src/app/shared/models/set.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { TopicService } from 'src/app/shared/services/topic.service';
import { Attribute } from 'src/app/shared/models/attribute.model';

@Component({
  selector: 'app-set-edit',
  templateUrl: './set-edit.component.html',
  styleUrls: ['./set-edit.component.scss']
})
export class SetEditComponent implements OnInit {
  setId: string;
  topicId: string;
  setForm: FormGroup;
  topic: Topic;
  isEditMode = false;
  topicObservable: Observable<Topic>;
  saveBtnTxt = "Create";

  constructor(    
    private router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
    private toastService: ToasterService,
    private loader: LoadingService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.topicId = params['id'];
      this.initForm();

      // if (this.topicId) {
      //   this.isEditMode = true;
      //   this.saveBtnTxt = "Save";

        this.topicObservable = this.topicService
          .getTopic(this.topicId)
          .pipe(tap((topic: Topic) => {
            // this.setForm.patchValue(topic.setTemplate);
            let attributes = (<FormArray>this.setForm.get('attributes'));
            attributes.clear();
            topic.setTemplate.forEach(attribute => {
              attributes.push(
                new FormGroup({'attribute': new FormControl('')})
              );
            })
          }));
        this.topicObservable.subscribe((topic) => {
          this.topic = topic;
        })
      // }
    })
  }

  initForm() {
    this.setForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'attributes': new FormArray([])
    });
  }

  get attributesControl() {
    return (<FormArray>this.setForm.get('attributes')).controls;
  }

  onSave() {
    // is it valid?
    if (this.setForm.valid) {
      this.loader.startLoading();
      let partialSet = this.setForm.value;
      let attributes: Attribute[] = partialSet.attributes.map((attribute, i) => new Attribute(i + 1, attribute.attribute))

      let set = new Set(
        '', 
        partialSet.name, 
        [], 
        attributes
      )
      console.log(set);
      
      // save it
      this.topicService.saveSet(this.topicId, set).subscribe(() => {
        this.router.navigate([`/topics/${this.topic.id}`]);
        this.loader.stopLoading();
        this.toastService.generateToast(`Created set "${set.name}"`, 3000);
      });
    }


  }

}
