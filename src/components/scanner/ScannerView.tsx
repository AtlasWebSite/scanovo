import { ArrowLeft, Camera, Check, Flashlight, ImagePlus, Sparkles, Wand2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createCameraCapture, createSimulatedScan, readFileAsDataUrl, validateImageFile } from '../../utils/image';
import { IconButton } from '../ui/IconButton';

interface ScannerViewProps {
  onBack: () => void;
  onCapture: (imageUrl: string) => void;
  onError: (message: string) => void;
}

export function ScannerView({ onBack, onCapture, onError }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function openCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError('Camera indisponivel neste navegador. Use a importacao de imagem.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        onError('Nao foi possivel acessar a camera.');
      }
    }

    void openCamera();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onError]);

  async function handleCapture() {
    try {
      if (!videoRef.current || !cameraReady) {
        onCapture(createSimulatedScan());
        return;
      }

      const imageUrl = await createCameraCapture(videoRef.current);
      onCapture(imageUrl);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Nao foi possivel capturar a pagina.');
    }
  }

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      onError(validationError);
      return;
    }

    try {
      onCapture(await readFileAsDataUrl(file));
    } catch {
      onError('Nao foi possivel importar a imagem.');
    }
  }

  return (
    <section className="scanner-view">
      <div className="scanner-topbar">
        <IconButton icon={ArrowLeft} label="Voltar" onClick={onBack} variant="dark" />
        <div>
          <strong>Digitalizar</strong>
          <span>{cameraReady ? 'Camera pronta' : 'Modo demonstracao'}</span>
        </div>
        <IconButton
          active={flashOn}
          icon={Flashlight}
          label="Flash"
          onClick={() => setFlashOn((enabled) => !enabled)}
          variant="dark"
        />
      </div>
      <div className="camera-stage">
        <video muted playsInline ref={videoRef} />
        {!cameraReady ? <div className="camera-stage__fallback">Aponte para um documento ou importe uma imagem</div> : null}
        <div className="scan-frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="alignment-pill">
          <Sparkles size={16} />
          Bordas detectadas
        </div>
      </div>
      <div className="scanner-options">
        <button className={autoMode ? 'is-active' : ''} onClick={() => setAutoMode((enabled) => !enabled)} type="button">
          <Wand2 size={17} /> Auto
        </button>
        <button type="button">
          <Check size={17} /> Filtros
        </button>
      </div>
      <div className="scanner-actions">
        <IconButton icon={ImagePlus} label="Importar imagem" onClick={() => fileInputRef.current?.click()} variant="dark" />
        <button className="capture-button" onClick={handleCapture} type="button" aria-label="Capturar pagina">
          <Camera size={30} />
        </button>
        <IconButton icon={Wand2} label="Captura simulada" onClick={() => onCapture(createSimulatedScan())} variant="dark" />
      </div>
      <input
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(event) => void handleFileChange(event.target.files)}
        ref={fileInputRef}
        type="file"
      />
    </section>
  );
}
