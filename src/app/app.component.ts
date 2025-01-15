import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  camera,
  cameraOutline,
  cameraReverse,
  cameraReverseOutline,
  cameraSharp,
  chevronBackOutline,
  chevronForwardOutline,
  chevronUpCircle,
  closeCircle,
  image,
  settingsOutline,
  settingsSharp,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  imports: [IonApp, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      chevronUpCircle,
      closeCircle,
      settingsOutline,
      settingsSharp,
      image,
      cameraOutline,
      cameraSharp,
      camera,
      cameraReverseOutline,
    });
  }
}
