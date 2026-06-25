import { Camera } from 'lucide-react';

interface FloatingScanButtonProps {
  onClick: () => void;
}

export function FloatingScanButton({ onClick }: FloatingScanButtonProps) {
  return (
    <button className="floating-scan" onClick={onClick} type="button" aria-label="Digitalizar documento">
      <Camera size={28} />
    </button>
  );
}
