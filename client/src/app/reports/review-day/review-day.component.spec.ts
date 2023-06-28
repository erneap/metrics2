import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDayComponent } from './review-day.component';

describe('ReviewDayComponent', () => {
  let component: ReviewDayComponent;
  let fixture: ComponentFixture<ReviewDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
