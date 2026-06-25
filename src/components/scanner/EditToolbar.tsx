import { Crop, FilePlus2, RotateCw, Save, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';

interface EditToolbarProps {
  onAddPage: () => void;
  onCrop: () => void;
  onDeletePage: () => void;
  onRotate: () => void;
  onSave: () => void;
  onToggleFilters: () => void;
  saving?: boolean;
}

export function EditToolbar({
  onAddPage,
  onCrop,
  onDeletePage,
  onRotate,
  onSave,
  onToggleFilters,
  saving,
}: EditToolbarProps) {
  return (
    <div className="edit-toolbar">
      <div className="edit-toolbar__tools">
        <IconButton icon={Crop} label="Cortar bordas" onClick={onCrop} />
        <IconButton icon={RotateCw} label="Girar pagina" onClick={onRotate} />
        <IconButton icon={SlidersHorizontal} label="Filtros e contraste" onClick={onToggleFilters} />
        <IconButton icon={FilePlus2} label="Adicionar pagina" onClick={onAddPage} />
        <IconButton icon={Trash2} label="Excluir pagina" onClick={onDeletePage} variant="danger" />
      </div>
      <Button icon={Save} loading={saving} onClick={onSave}>
        Salvar
      </Button>
    </div>
  );
}
