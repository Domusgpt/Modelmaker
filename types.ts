
export interface UploadedImage {
  name: string;
  data: string; // base64 encoded string
  mimeType: string;
  dataUrl?: string; // full data URL for previews
}
