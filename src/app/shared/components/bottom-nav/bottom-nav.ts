import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { IonIcon } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  walletOutline,
  add,
  statsChartOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonIcon
  ],
  templateUrl: './bottom-nav.html',
  styleUrls: ['./bottom-nav.scss']
})
export class BottomNavComponent {

  constructor() {
    addIcons({
      homeOutline,
      walletOutline,
      add,
      statsChartOutline,
      personOutline
    });
  }

}