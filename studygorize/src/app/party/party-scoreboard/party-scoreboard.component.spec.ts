import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyScoreboardComponent } from './party-scoreboard.component';

describe('PartyScoreboardComponent', () => {
  let component: PartyScoreboardComponent;
  let fixture: ComponentFixture<PartyScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyScoreboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
