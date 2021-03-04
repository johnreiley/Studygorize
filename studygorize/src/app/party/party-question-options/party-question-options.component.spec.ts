import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyQuestionOptionsComponent } from './party-question-options.component';

describe('PartyQuestionOptionsComponent', () => {
  let component: PartyQuestionOptionsComponent;
  let fixture: ComponentFixture<PartyQuestionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyQuestionOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyQuestionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
