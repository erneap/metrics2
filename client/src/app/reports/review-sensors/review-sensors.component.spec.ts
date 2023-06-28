import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSensorsComponent } from './review-sensors.component';

describe('ReviewSensorsComponent', () => {
  let component: ReviewSensorsComponent;
  let fixture: ComponentFixture<ReviewSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSensorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
