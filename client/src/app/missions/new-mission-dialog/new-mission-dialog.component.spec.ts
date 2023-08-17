import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMissionDialogComponent } from './new-mission-dialog.component';

describe('NewMissionDialogComponent', () => {
  let component: NewMissionDialogComponent;
  let fixture: ComponentFixture<NewMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMissionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
