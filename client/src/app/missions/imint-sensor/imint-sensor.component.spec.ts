import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImintSensorComponent } from './imint-sensor.component';

describe('ImintSensorComponent', () => {
  let component: ImintSensorComponent;
  let fixture: ComponentFixture<ImintSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImintSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImintSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
