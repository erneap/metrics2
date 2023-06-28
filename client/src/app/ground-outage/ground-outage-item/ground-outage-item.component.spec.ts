import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundOutageItemComponent } from './ground-outage-item.component';

describe('GroundOutageItemComponent', () => {
  let component: GroundOutageItemComponent;
  let fixture: ComponentFixture<GroundOutageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundOutageItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundOutageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
