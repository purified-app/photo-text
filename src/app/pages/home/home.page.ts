import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { createWorker } from 'tesseract.js';
import { CameraModalService } from '../../components/camera-modal/camera-modal.service';

@Component({
  selector: 'app-home',
  imports: [
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
  ],
  template: `
    <ion-content class="ion-padding">
      <div class="home-content">
        <input
          #fileInput
          accept="image/*"
          hidden
          type="file"
          (change)="onFileSelected()"
        />
        <ion-button (click)="fileInput.click()">
          <ion-icon slot="start" name="image"></ion-icon>
          Upload
        </ion-button>
        <ion-button (click)="openCameraModal()">
          <ion-icon slot="start" name="camera"></ion-icon>
          Camera
        </ion-button>
        <ion-button color="danger" (click)="items.set([])">
          <ion-icon slot="start" name="close-circle"></ion-icon>
          Clear
        </ion-button>
      </div>

      @if(items().length > 0) {
      <ion-list>
        <ion-list-header>Recognized Text</ion-list-header>
        @for (item of items(); track $index) {
        <ion-item [button]="true" (click)="copyItemTextToClipboard(item)">
          <ion-label>{{ item }}</ion-label>
        </ion-item>
        }
      </ion-list>
      }
    </ion-content>
  `,
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit, OnDestroy {
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  items = signal<string[]>([]);

  private worker!: Tesseract.Worker;
  private cameraService = inject(CameraModalService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  async ngOnInit() {
    this.worker = await createWorker('eng');
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

  async copyItemTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    const toast = await this.toastController.create({
      duration: 2000,
      color: 'success',
      message: `Copied to clipboard!`,
      position: 'bottom',
    });
    toast.present();
  }

  async openCameraModal() {
    const modal = await this.cameraService.presentModal();
    modal.onDidDismiss().then(({ data, role }) => {
      if (role === 'capture') {
        const file = data as File;
        this.onFileSelected(file);
      } else {
        this.loadingController.dismiss();
      }
    });
  }

  async onFileSelected(file?: File) {
    if (!file) {
      file = this.fileInput()?.nativeElement?.files?.[0];
    }
    if (!file) return;
    const recognized = await this.worker.recognize(file);
    const cleanText = this.cleanText(recognized.data.text);
    const results = cleanText.split(' ').filter(Boolean);
    this.items.set(results);
    if (!results.length) {
      this.toastController
        .create({
          duration: 2000,
          color: 'warning',
          message: `No text found`,
          position: 'bottom',
        })
        .then((toast) => toast.present());
    }
    this.loadingController.dismiss();
  }

  // Function to clean text
  private cleanText(text: string) {
    // Replace newlines and tabs with spaces
    let cleaned = text.replace(/[\n\t]/g, ' ');

    // Remove any characters that are not letters, numbers, or spaces
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s]{3,}/g, ' ');

    // Split into words, filter for those over 5 characters, and join again
    const words = cleaned.split(/\s+/).filter((word) => word.length > 5);

    return words.join(' ').trim();
  }
}
