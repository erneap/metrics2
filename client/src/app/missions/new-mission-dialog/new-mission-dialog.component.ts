import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SortieData {
  sortieID: string;
}

@Component({
  selector: 'app-new-mission-dialog',
  templateUrl: './new-mission-dialog.component.html',
  styleUrls: ['./new-mission-dialog.component.scss']
})
export class NewMissionDialogComponent {
  sortieForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SortieData,
    private fb: FormBuilder
  ) {
    this.sortieForm = this.fb.group({
      sortie: [this.data.sortieID, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
