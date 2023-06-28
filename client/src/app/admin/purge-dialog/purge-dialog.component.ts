import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-purge-dialog',
  templateUrl: './purge-dialog.component.html',
  styleUrls: ['./purge-dialog.component.scss']
})
export class PurgeDialogComponent {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<PurgeDialogComponent>,
  ) {}
}
