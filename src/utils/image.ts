import type { PageFilter } from '../types/document';

export const MAX_IMAGE_SIZE_MB = 12;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function getFilterStyle(filter: PageFilter): string {
  if (filter === 'sharp') {
    return 'contrast(1.18) saturate(0.95) brightness(1.05)';
  }

  if (filter === 'bw') {
    return 'grayscale(1) contrast(1.65) brightness(1.08)';
  }

  if (filter === 'gray') {
    return 'grayscale(1) contrast(1.08)';
  }

  if (filter === 'contrast') {
    return 'contrast(1.42) brightness(1.03) saturate(0.9)';
  }

  return 'none';
}

export function validateImageFile(file: File): string | null {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use uma imagem JPG, PNG ou WebP.';
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `A imagem deve ter ate ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Imagem invalida.'));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error('Nao foi possivel ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

export async function cropDocumentImage(imageUrl: string): Promise<string> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Nao foi possivel preparar o corte.');
  }

  const insetX = Math.round(image.width * 0.06);
  const insetY = Math.round(image.height * 0.06);
  canvas.width = image.width - insetX * 2;
  canvas.height = image.height - insetY * 2;
  context.drawImage(
    image,
    insetX,
    insetY,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL('image/jpeg', 0.92);
}

export async function createCameraCapture(video: HTMLVideoElement): Promise<string> {
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error('A camera ainda nao esta pronta.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Nao foi possivel capturar a imagem.');
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.9);
}

export function createSimulatedScan(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Nao foi possivel criar a pagina.');
  }

  context.fillStyle = '#f3f4f6';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff';
  context.shadowColor = 'rgba(15, 23, 42, 0.18)';
  context.shadowBlur = 36;
  context.shadowOffsetY = 18;
  roundRect(context, 150, 130, 900, 1280, 38);
  context.fill();
  context.shadowColor = 'transparent';
  context.fillStyle = '#111827';
  context.font = '700 54px Inter, Arial';
  context.fillText('Documento digitalizado', 230, 280);
  context.fillStyle = '#94a3b8';
  context.font = '32px Inter, Arial';

  for (let index = 0; index < 14; index += 1) {
    const width = index % 4 === 0 ? 520 : 650 + (index % 3) * 40;
    context.fillRect(230, 380 + index * 68, width, 18);
  }

  context.strokeStyle = '#2563eb';
  context.lineWidth = 14;
  context.strokeRect(230, 1160, 260, 110);
  context.fillStyle = '#2563eb';
  context.font = '700 34px Inter, Arial';
  context.fillText('SCANOVO', 275, 1228);

  return canvas.toDataURL('image/jpeg', 0.92);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Imagem invalida.'));
    image.src = src;
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}
