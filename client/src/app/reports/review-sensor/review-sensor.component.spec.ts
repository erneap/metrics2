import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSensorComponent } from './review-sensor.component';

describe('ReviewSensorComponent', () => {
  let component: ReviewSensorComponent;
  let fixture: ComponentFixture<ReviewSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
