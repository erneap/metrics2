import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOutageDialogComponent } from './delete-outage-dialog.component';

describe('DeleteOutageDialogComponent', () => {
  let component: DeleteOutageDialogComponent;
  let fixture: ComponentFixture<DeleteOutageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOutageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOutageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
