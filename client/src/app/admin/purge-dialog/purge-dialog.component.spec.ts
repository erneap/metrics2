import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgeDialogComponent } from './purge-dialog.component';

describe('PurgeDialogComponent', () => {
  let component: PurgeDialogComponent;
  let fixture: ComponentFixture<PurgeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurgeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
