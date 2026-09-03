import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  walletOutline,
  receiptOutline,
  statsChartOutline,
  settingsOutline,
  diamondOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon],
  templateUrl: './sidebar-nav.html',
  styleUrls: ['./sidebar-nav.scss']
})
export class SidebarNavComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({
      homeOutline,
      walletOutline,
      receiptOutline,
      statsChartOutline,
      settingsOutline,
      diamondOutline,
      logOutOutline
    });
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth/login');
  }
}