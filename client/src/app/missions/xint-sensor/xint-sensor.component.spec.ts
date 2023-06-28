import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XintSensorComponent } from './xint-sensor.component';

describe('XintSensorComponent', () => {
  let component: XintSensorComponent;
  let fixture: ComponentFixture<XintSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XintSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XintSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
