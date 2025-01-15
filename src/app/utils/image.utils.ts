export class ImageUtils {
  static createCanvasFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  static createCanvasFromVideoFrame(video: HTMLVideoElement): HTMLCanvasElement {
    // Get the bounding rectangles
    const captureFrame = video.parentElement!.querySelector('.capture-frame')!;
    const frameRect = captureFrame.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();

    // Calculate the position of the frame relative to the video
    // Since captureFrame is centered using transform, we need to adjust for this
    const left = frameRect.left - videoRect.left;
    // Adjust top for the transform centering
    const top = frameRect.top - videoRect.top + frameRect.height / 2; // Half of frame's height due to translate(-50%)
    const width = frameRect.width;
    const height = frameRect.height;

    // Create a new canvas with dimensions of the capture frame
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    // Draw only the part of the video that matches the capture frame
    context.drawImage(video, left, top, width, height, 0, 0, width, height);

    return canvas;
  }
}
