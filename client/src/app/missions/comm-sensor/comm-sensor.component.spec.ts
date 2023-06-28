import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommSensorComponent } from './comm-sensor.component';

describe('CommSensorComponent', () => {
  let component: CommSensorComponent;
  let fixture: ComponentFixture<CommSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
