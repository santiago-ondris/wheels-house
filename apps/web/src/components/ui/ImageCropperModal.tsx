import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../lib/image-utils';
import { X, Crop, ZoomIn } from 'lucide-react';

interface ImageCropperModalProps {
    image: string;
    onSave: (croppedImage: Blob) => void;
    onCancel: () => void;
    aspect?: number;
    cropShape?: 'rect' | 'round';
}

export default function ImageCropperModal({
    image,
    onSave,
    onCancel,
    aspect = 4 / 3,
    cropShape = 'rect'
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_showedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            if (!croppedAreaPixels) return;
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) {
                onSave(croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="relative w-full h-full md:w-[90vw] md:h-[80vh] md:max-w-4xl bg-dark md:rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Crop className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-white">Recortar Imagen</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 bg-black/20">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        classes={{
                            containerClassName: "bg-black/20",
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 bg-white/[0.02] border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <ZoomIn className="w-4 h-4 text-white/40" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 accent-accent"
                        />
                        <span className="text-xs font-mono text-white/40 w-8">{zoom.toFixed(1)}x</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-6 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-[2] py-3 px-6 bg-accent hover:bg-accent/80 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-accent/20"
                        >
                            Guardar Recorte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
