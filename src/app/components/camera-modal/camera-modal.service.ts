import { ModalController } from '@ionic/angular/standalone';
import { inject, Injectable } from '@angular/core';
import { CameraModalComponent } from './camera-modal.component';

@Injectable({ providedIn: 'root' })
export class CameraModalService {
  ModalController = inject(ModalController);

  async presentModal() {
    const modal = await this.ModalController.create({
      component: CameraModalComponent,
    });
    modal.present();
    return modal;
  }
}
