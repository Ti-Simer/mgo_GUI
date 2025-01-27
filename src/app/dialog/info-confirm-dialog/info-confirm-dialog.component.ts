import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info-confirm-dialog',
  templateUrl: './info-confirm-dialog.component.html',
  styleUrls: ['./info-confirm-dialog.component.scss']
})
export class InfoConfirmDialogComponent {
  private languageSubscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<InfoConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Devuelve true al cerrar el diálogo
  }

  onCancel(): void {
    this.dialogRef.close(false); // Devuelve false al cerrar el diálogo
  }
}
