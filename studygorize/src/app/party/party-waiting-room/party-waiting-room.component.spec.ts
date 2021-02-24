import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyWaitingRoomComponent } from './party-waiting-room.component';

describe('PartyWaitingRoomComponent', () => {
  let component: PartyWaitingRoomComponent;
  let fixture: ComponentFixture<PartyWaitingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyWaitingRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyWaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
