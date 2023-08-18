import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SortieData } from '../new-mission-dialog/new-mission-dialog.component';

@Component({
  selector: 'app-change-sortie-id-dialog',
  templateUrl: './change-sortie-id-dialog.component.html',
  styleUrls: ['./change-sortie-id-dialog.component.scss']
})
export class ChangeSortieIdDialogComponent {
  sortieForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangeSortieIdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SortieData,
    private fb: FormBuilder
  ) {
    console.log(this.data.sortieID);
    this.sortieForm = this.fb.group({
      sortie: [this.data.sortieID, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
