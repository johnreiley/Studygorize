import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteBannerComponent } from './website-banner.component';

describe('WebsiteBannerComponent', () => {
  let component: WebsiteBannerComponent;
  let fixture: ComponentFixture<WebsiteBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
