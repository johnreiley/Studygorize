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
import { TopicModalDeleteComponent } from '../../topic-modal-delete/topic-modal-delete.component';

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
  originalSet: Set;
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
      this.setId = params['setId'];
      this.initForm();

      if (this.setId) {
        this.isEditMode = true;
        this.saveBtnTxt = "Save";
      }

      this.topicObservable = this.topicService
        .getTopic(this.topicId)
        .pipe(tap((topic: Topic) => {
          if (this.isEditMode) {
            this.originalSet = topic.sets.find(s => s.id === this.setId);
            this.setForm.patchValue(this.originalSet);
          }
          let attributes = (<FormArray>this.setForm.get('attributes'));
          attributes.clear();
          if (this.isEditMode) {
            topic.setTemplate.forEach((attribute, i) => {
              attributes.push(
                new FormGroup({'attribute': new FormControl(this.originalSet.attributes[i].value)})
              );
            });
          } else {
            topic.setTemplate.forEach(attribute => {
              attributes.push(
                new FormGroup({'attribute': new FormControl('')})
                );
              });
            }
        }));
      this.topicObservable.subscribe((topic) => {
        this.topic = topic;
      });
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
      if (this.isEditMode) {
        this.topicService.updateSet(this.topicId, this.originalSet, set).subscribe(() => {
          this.router.navigate([`/topics/${this.topicId}/set/${this.setId}`]);
          this.loader.stopLoading();
          this.toastService.generateToast(`Updated set "${set.name}"`, 3000);
        });
      } else {
        this.topicService.saveSet(this.topicId, set).subscribe(() => {
          this.router.navigate([`/topics/${this.topic.id}`]);
          this.loader.stopLoading();
          this.toastService.generateToast(`Created set "${set.name}"`, 3000);
        });
      }
    }
  }

  onDelete() {
    this.loader.startLoading();
    this.topicService.deleteSet(this.topicId, this.setId).subscribe(() => {
      this.router.navigate([`/topics/${this.topicId}`]);
      this.loader.stopLoading();
      this.toastService.generateToast(`Successfully deleted set "${this.originalSet.name}"`, 3000);
    });
  }

  openModal() {
    const modalRef = this.modalService.open(TopicModalDeleteComponent);
    modalRef.componentInstance.topicTitle = this.topic.title;
    modalRef.componentInstance.entityType = "set";
    modalRef.componentInstance.entityName = this.originalSet.name;
    modalRef.componentInstance.modalTitle = "Delete Set";

    modalRef.componentInstance.deleteEvent.subscribe(() => {
      this.onDelete();
    });
  }

}
