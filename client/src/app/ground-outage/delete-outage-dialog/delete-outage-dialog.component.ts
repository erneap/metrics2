import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-outage-dialog',
  templateUrl: './delete-outage-dialog.component.html',
  styleUrls: ['./delete-outage-dialog.component.scss']
})
export class DeleteOutageDialogComponent {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<DeleteOutageDialogComponent>,
  ) {}
}
