import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag-badge',
  templateUrl: './tag-badge.component.html',
  styleUrls: ['./tag-badge.component.scss']
})
export class TagBadgeComponent implements OnInit {
  @Input() tag: string = "test tag"
  @Input() isEditMode: boolean;
  @Output() removeEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onRemove() {
    this.removeEvent.emit();
  }

}
