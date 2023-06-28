import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
  constructor(
    public authService: AuthService
  ) {}

  getOldReports() {
    let url = '/metrics/reportlists';
    window.open(url, "download");
  }
}
