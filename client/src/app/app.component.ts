import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  isMobile = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public authService: AuthService,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('calendar',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/icons/calendar.svg'));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  getHelp() {
    let url = '/metrics/clientHelp/index.html';
    window.open(url, "help_win");
  }

  getOldReports() {
    let url = '/metrics/reportlists';
    window.open(url, "download");
  }
}
