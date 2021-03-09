import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyScoreboardLabelComponent } from './party-scoreboard-label.component';

describe('PartyScoreboardLabelComponent', () => {
  let component: PartyScoreboardLabelComponent;
  let fixture: ComponentFixture<PartyScoreboardLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyScoreboardLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyScoreboardLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
