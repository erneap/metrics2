import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundOutageComponent } from './ground-outage.component';

describe('GroundOutageComponent', () => {
  let component: GroundOutageComponent;
  let fixture: ComponentFixture<GroundOutageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundOutageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundOutageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
