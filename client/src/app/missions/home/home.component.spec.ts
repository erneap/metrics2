import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: MissionsHomeComponent;
  let fixture: ComponentFixture<MissionsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
