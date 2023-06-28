import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultGroundOutage, IGroundOutage, GroundOutage } 
  from 'src/app/models/interfaces/groundOutage';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { OutageService } from 'src/app/services/outage.service';
import { DeleteOutageDialogComponent } 
  from '../delete-outage-dialog/delete-outage-dialog.component';

@Component({
  selector: 'app-ground-outage-item',
  templateUrl: './ground-outage-item.component.html',
  styleUrls: ['./ground-outage-item.component.scss']
})
export class GroundOutageItemComponent {
  private _outage?: GroundOutage
  @Input() 
  public set outage(out: IGroundOutage) {
    this._outage = new GroundOutage(out);
  }
  get outage(): GroundOutage {
    if (this._outage) {
      return this._outage;
    } else {
      return new GroundOutage(DefaultGroundOutage);
    }
  }
  @Output() selected = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<string>();
  
  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
    protected dialog: MatDialog
  ) { }

  onClick() {
    this.selected.emit(this.outage.id)
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteOutageDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        this.dialogService.showSpinner();
        const outageid = this.outageService.selectedOutage?.id;
        this.outageService.deleteOutage()
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              this.outageService.selectedOutage = undefined;
              let found = false;
              for (let i=0; i < this.outageService.allOutages.length && !found; i++) {
                if (this.outageService.allOutages[i].id === outageid) {
                  this.outageService.allOutages.splice(i, 1);
                }
              }
              this.outageService.changesMade.next();
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          })
      }
    });
  }

  getDate(outageDate: Date): string {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec" ];
    if (outageDate.getDate() < 10) {
      return `0${outageDate.getDate()} ${months[outageDate.getMonth()]} ${outageDate.getFullYear()}`;
    } else {
      return `${outageDate.getDate()} ${months[outageDate.getMonth()]} ${outageDate.getFullYear()}`;
    }
  }
}
