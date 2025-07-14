import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-details-notification',
  templateUrl: './dialog-details-notification.component.html',
  styleUrls: ['./dialog-details-notification.component.scss']
})
export class DialogDetailsNotificationComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDetailsNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

}
