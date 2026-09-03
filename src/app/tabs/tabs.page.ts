import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { BottomNavComponent } from '../shared/components/bottom-nav/bottom-nav';
import { SidebarNavComponent } from '../shared/components/sidebar-nav/sidebar-nav';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    IonRouterOutlet,
    BottomNavComponent,
    SidebarNavComponent
  ],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {}