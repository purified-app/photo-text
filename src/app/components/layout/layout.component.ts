import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  chevronUpCircle,
  settingsOutline,
  settingsSharp,
  documentTextOutline,
  documentTextSharp,
  closeCircle,
} from 'ionicons/icons';

@Component({
  selector: 'app-layout',
  imports: [
    AsyncPipe,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    RouterLink,
    RouterOutlet,
  ],
  template: `
    <ion-split-pane contentId="main">
      <ion-menu contentId="main" type="overlay">
        <ion-header>
          <ion-toolbar>
            <ion-title>Photo Text</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            @for (page of appPages; track $index) {
            <ion-menu-toggle auto-hide="false">
              <ion-item
                detail="false"
                lines="none"
                routerDirection="root"
                routerLinkActive="selected"
                [button]="true"
                [routerLink]="[page.url]"
              >
                <ion-icon
                  slot="start"
                  [ios]="page.icon + '-outline'"
                  [md]="page.icon + '-sharp'"
                ></ion-icon>
                <ion-label>{{ page.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            }
          </ion-list>
        </ion-content>
      </ion-menu>

      <div class="ion-page" id="main">
        <ion-header>
          <ion-toolbar>
            @let data = this.activeRoute.firstChild?.data | async;
            <ion-title>{{ data?.['title'] }}</ion-title>
            <ion-buttons slot="end" [collapse]="true">
              <ion-menu-button auto-hide="true"></ion-menu-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <router-outlet />
        </ion-content>
      </div>
    </ion-split-pane>
  `,
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  protected activeRoute = inject(ActivatedRoute);

  protected appPages = [
    { title: 'OCR', url: '/home', icon: 'camera' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      chevronUpCircle,
      closeCircle,
      settingsOutline,
      settingsSharp,
      documentTextOutline,
      documentTextSharp,
    });
  }
}
