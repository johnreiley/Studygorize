import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyOptionsComponent } from './party-options.component';

describe('PartyOptionsComponent', () => {
  let component: PartyOptionsComponent;
  let fixture: ComponentFixture<PartyOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
