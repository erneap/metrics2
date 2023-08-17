import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSortieIdDialogComponent } from './change-sortie-id-dialog.component';

describe('ChangeSortieIdDialogComponent', () => {
  let component: ChangeSortieIdDialogComponent;
  let fixture: ComponentFixture<ChangeSortieIdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSortieIdDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeSortieIdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
