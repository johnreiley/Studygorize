import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicLiteComponent } from './topic-lite.component';

describe('TopicLiteComponent', () => {
  let component: TopicLiteComponent;
  let fixture: ComponentFixture<TopicLiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicLiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
