import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { useHideContent } from '../hooks/useHideContent';

interface HideContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityId: number;
    entityType: 'car' | 'group';
    onSuccess: () => void;
}

export default function HideContentModal({ isOpen, onClose, entityId, entityType, onSuccess }: HideContentModalProps) {
    const [reason, setReason] = useState('');
    const { hideCar, hideGroup, isLoading } = useHideContent();

    const handleConfirm = async () => {
        if (!reason.trim()) return;

        let success = false;
        if (entityType === 'car') {
            success = await hideCar(entityId, reason);
        } else {
            success = await hideGroup(entityId, reason);
        }

        if (success) {
            onSuccess();
            onClose();
            setReason('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Ocultar ${entityType === 'car' ? 'Auto' : 'Grupo'}`}>
            <div className="flex flex-col gap-4">
                <p className="text-white/70">
                    ¿Estás seguro de que queres ocultar este contenido?
                    No será visible en los feeds públicos.
                </p>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/80">Motivo (Interno)</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Spam, Inapropiado..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !reason.trim()}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isLoading ? 'Ocultando...' : 'Confirmar Ocultamiento'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
