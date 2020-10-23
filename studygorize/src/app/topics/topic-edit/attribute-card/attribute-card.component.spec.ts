import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCardComponent } from './attribute-card.component';

describe('AttributeCardComponent', () => {
  let component: AttributeCardComponent;
  let fixture: ComponentFixture<AttributeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
