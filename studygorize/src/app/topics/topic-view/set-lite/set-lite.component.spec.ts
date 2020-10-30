import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLiteComponent } from './set-lite.component';

describe('SetLiteComponent', () => {
  let component: SetLiteComponent;
  let fixture: ComponentFixture<SetLiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetLiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
