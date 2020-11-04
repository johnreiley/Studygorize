import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetViewComponent } from './set-view.component';

describe('SetViewComponent', () => {
  let component: SetViewComponent;
  let fixture: ComponentFixture<SetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
