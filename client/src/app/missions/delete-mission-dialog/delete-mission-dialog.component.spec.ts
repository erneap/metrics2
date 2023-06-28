import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMissionDialogComponent } from './delete-mission-dialog.component';

describe('DeleteMissionDialogComponent', () => {
  let component: DeleteMissionDialogComponent;
  let fixture: ComponentFixture<DeleteMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMissionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
