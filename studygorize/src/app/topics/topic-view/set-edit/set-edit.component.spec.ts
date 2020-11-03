import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEditComponent } from './set-edit.component';

describe('SetEditComponent', () => {
  let component: SetEditComponent;
  let fixture: ComponentFixture<SetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
