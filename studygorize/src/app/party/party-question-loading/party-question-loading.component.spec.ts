import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyQuestionLoadingComponent } from './party-question-loading.component';

describe('PartyQuestionLoadingComponent', () => {
  let component: PartyQuestionLoadingComponent;
  let fixture: ComponentFixture<PartyQuestionLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyQuestionLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyQuestionLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
