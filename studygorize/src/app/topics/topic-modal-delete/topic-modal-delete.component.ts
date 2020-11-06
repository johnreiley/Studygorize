import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-topic-modal-delete',
  templateUrl: './topic-modal-delete.component.html',
  styleUrls: ['./topic-modal-delete.component.scss']
})
export class TopicModalDeleteComponent implements OnInit {
  @Input() topicTitle: string;
  @Input() entityType: string;
  @Input() entityName: string;
  @Input() modalTitle: string;
  @Input() modalMessage: string;
  @Output() deleteEvent = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  emitDelete() {
    this.deleteEvent.emit();
    this.activeModal.close();
  }



}
