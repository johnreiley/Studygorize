import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyQuestionOptionComponent } from './party-question-option.component';

describe('PartyQuestionOptionComponent', () => {
  let component: PartyQuestionOptionComponent;
  let fixture: ComponentFixture<PartyQuestionOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyQuestionOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyQuestionOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
