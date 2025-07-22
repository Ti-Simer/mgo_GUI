import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-all-log-report',
  templateUrl: './dialog-all-log-report.component.html',
  styleUrls: ['./dialog-all-log-report.component.scss']
})
export class DialogAllLogReportComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAllLogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
}
  onClose(): void {
    this.dialogRef.close();
  }
}






