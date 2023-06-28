import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMissionComponent } from './review-mission.component';

describe('ReviewMissionComponent', () => {
  let component: ReviewMissionComponent;
  let fixture: ComponentFixture<ReviewMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
