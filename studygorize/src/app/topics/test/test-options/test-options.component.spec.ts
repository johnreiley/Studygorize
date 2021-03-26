import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOptionsComponent } from './test-options.component';

describe('TestOptionsComponent', () => {
  let component: TestOptionsComponent;
  let fixture: ComponentFixture<TestOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
