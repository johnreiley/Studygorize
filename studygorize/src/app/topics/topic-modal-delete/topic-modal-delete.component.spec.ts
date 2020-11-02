import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicModalDeleteComponent } from './topic-modal-delete.component';

describe('TopicModalDeleteComponent', () => {
  let component: TopicModalDeleteComponent;
  let fixture: ComponentFixture<TopicModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicModalDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
