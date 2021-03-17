import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyResultsComponent } from './party-results.component';

describe('PartyResultsComponent', () => {
  let component: PartyResultsComponent;
  let fixture: ComponentFixture<PartyResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
