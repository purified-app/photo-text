export default class MediaDevicesUtils {
  static hasMediaStreamCapability(mediaStream: MediaStream, capability: string) {
    const capabilities = mediaStream.getVideoTracks()[0].getCapabilities();
    return Object.keys(capabilities!).includes(capability);
  }
  static async applyZoom(stream: MediaStream, zoom: number) {
    const track = stream.getVideoTracks()[0];
    if (MediaDevicesUtils.hasMediaStreamCapability(stream, 'zoom')) {
      const constraints = { zoom } as MediaTrackConstraints;
      await track?.applyConstraints(constraints);
    }
  }
}
