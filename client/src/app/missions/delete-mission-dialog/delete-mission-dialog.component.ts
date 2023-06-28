import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-mission-dialog',
  templateUrl: './delete-mission-dialog.component.html',
  styleUrls: ['./delete-mission-dialog.component.scss']
})
export class DeleteMissionDialogComponent {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<DeleteMissionDialogComponent>,
  ) {}
}
