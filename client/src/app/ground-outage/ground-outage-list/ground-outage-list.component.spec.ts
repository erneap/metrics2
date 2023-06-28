import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundOutageListComponent } from './ground-outage-list.component';

describe('GroundOutageListComponent', () => {
  let component: GroundOutageListComponent;
  let fixture: ComponentFixture<GroundOutageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundOutageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundOutageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
