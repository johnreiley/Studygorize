import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-attribute-card',
  templateUrl: './attribute-card.component.html',
  styleUrls: ['./attribute-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AttributeCardComponent),
    }
  ]
})
export class AttributeCardComponent implements OnInit, ControlValueAccessor {
  @ViewChild('card') card: ElementRef;
  @Output() deleteEvent = new EventEmitter<boolean>(); 
  @Input() parentForm: FormGroup;
  @Input() public id: number;
  attribute: string;

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.deleteEvent.emit(true);
  }

  onChange = (attribute: string) => {}

  onTouched = () => {}

  writeValue(attribute: string) {
    this.attribute = attribute;
    this.onChange(attribute);
  }

  registerOnChange(fn: (attribute: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
