import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer-lite',
  templateUrl: './footer-lite.component.html',
  styleUrls: ['./footer-lite.component.scss']
})
export class FooterLiteComponent {
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService
  ) {
    this.authService.menuExpanded$.subscribe(expanded => {
      this.sidebarCollapsed = expanded;
    });
    // Constructor logic if needed
  }


}
