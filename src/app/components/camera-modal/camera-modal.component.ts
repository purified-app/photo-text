import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonRange,
  LoadingController,
  ModalController,
  RangeChangeEventDetail,
} from '@ionic/angular/standalone';
import { IonRangeCustomEvent } from '@ionic/core';
import MediaDevicesUtils from '../../utils/media-devices.utils';
import { TouchUtils } from '../../utils/touch.utils';
import { ImageUtils } from '../../utils/image.utils';

@Component({
  selector: 'app-camera-modal',
  imports: [IonFab, IonFabButton, IonIcon, IonRange],
  template: `
    <div class="video-container">
      <video #video autoplay></video>
      <div class="video-controls">
        @if(options?.enableFrameCapture ?? true) {
        <div class="capture-frame"></div>
        }
        <code>{{ text() }}</code>
        @if(!options?.disableZoom) {
        <ion-range
          step="0.1"
          labelPlacement="stacked"
          [debounce]="10"
          [label]="zoomValue() > 1 ? zoomValue() : ''"
          [min]="zoomMin()"
          [max]="zoomMax()"
          [value]="zoomValue()"
          (ionInput)="zoomChange($event)"
        ></ion-range>
        }
      </div>
    </div>
    <ion-fab horizontal="center" vertical="bottom">
      <ion-fab-button (click)="capturePhoto()">
        <ion-icon name="camera"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    @if(options?.enableCameraSwitching) {
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button (click)="switchCamera()">
        <ion-icon name="camera-reverse-outline"></ion-icon>
      </ion-fab-button> </ion-fab
    >}
  `,
  styleUrl: './camera-modal.component.css',
})
export class CameraModalComponent implements AfterViewInit, OnDestroy {
  options?: CameraModalOptions;
  /** 1 or higher */
  protected zoomMin = signal(1);
  protected zoomMax = signal(0);
  /** 1 or higher */
  protected zoomValue = signal(1);

  protected readonly videoElement = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  private modalController = inject(ModalController);
  private loadingController = inject(LoadingController);
  private stream?: MediaStream;

  private initialDistance = 0;
  private initialZoomValue = 1;
  text = signal('');

  async ngAfterViewInit() {
    await this.initMediaStream();
  }

  ngOnDestroy() {
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const { touches } = event;
    if (touches.length === 2) {
      this.initialDistance = TouchUtils.getTouchDistance(touches[0], touches[1]);
      this.initialZoomValue = this.zoomValue();
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.options?.disableZoom) this.zoomOnTouchMove(event);
  }

  private zoomOnTouchMove(event: TouchEvent) {
    const { touches } = event;
    if (touches.length === 2) {
      event.preventDefault();
      const touchDistance = TouchUtils.getTouchDistance(touches[0], touches[1]);
      let scale = this.initialZoomValue * (touchDistance / this.initialDistance);
      scale = Math.max(this.zoomMin(), Math.min(scale, this.zoomMax())); // Ensure scale is within min and max
      const zoomValue = Number(scale.toFixed(1));
      this.setZoom(zoomValue);
    }
  }

  private async initMediaStream(facingMode = 'environment') {
    const extraOptions = { zoom: { ideal: 1 } };
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { ...extraOptions, facingMode },
    });
    this.videoElement().nativeElement.srcObject = this.stream;

    const videoTrack = this.stream?.getVideoTracks()[0]!;
    const capabilities = await videoTrack?.getCapabilities();
    const { zoom } = capabilities as any;
    if (zoom?.min) this.zoomMin.set(zoom.min);
    if (zoom?.max) this.zoomMax.set(zoom.max);
  }

  zoomChange($event: IonRangeCustomEvent<RangeChangeEventDetail>) {
    const value = String($event.target.value);
    this.setZoom(Number(value));
  }

  switchCamera() {
    const track = this.stream?.getVideoTracks()[0];
    const facingMode = track?.getConstraints().facingMode === 'user' ? 'environment' : 'user';
    this.stream?.getTracks().forEach((track) => track.stop());
    this.initMediaStream(facingMode);
  }

  async setZoom(zoom: number) {
    this.zoomValue.set(zoom);
    MediaDevicesUtils.applyZoom(this.stream!, zoom);
  }

  async capturePhoto() {
    const loading = await this.loadingController.create({
      message: 'Looking for text...',
    });
    loading.present();
    const video = this.videoElement().nativeElement;
    const canvas = ImageUtils.createCanvasFromVideo(video);
    const image = document.createElement('img');
    image.src = canvas.toDataURL('image/jpeg', 0.95);
    canvas.toDataURL('image/jpeg', 0.95);
    canvas.toBlob((blob) => {
      this.modalController.dismiss(blob, 'capture');
    });
  }
}

interface MediaTrackConstraintsExtended extends MediaTrackConstraints {
  zoom?: ConstrainDouble;
}

interface CameraModalOptions {
  /** Default: true */
  disableZoom?: boolean;
  /** Default: false */
  enableCameraSwitching?: boolean;
  /** Default: true */
  enableFrameCapture?: boolean;
}
