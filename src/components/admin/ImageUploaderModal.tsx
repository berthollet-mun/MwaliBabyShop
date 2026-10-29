import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Link,
  X,
  Check,
  Image as ImageIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders
} from 'lucide-react';
import {
  compressImageFile,
  formatBytes,
  COMPRESSION_PRESETS,
  PresetKey,
  CompressionResult
} from '../../utils/imageCompression';

interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (imageUrl: string) => void;
  title?: string;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({
  isOpen,
  onClose,
  onImageSelected,
  title = "Ajouter une image",
}) => {
  const [tab, setTab] = useState<'pc' | 'camera' | 'url'>('pc');
  const [urlInput, setUrlInput] = useState('');
  const [urlPreview, setUrlPreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preset, setPreset] = useState<PresetKey>('balanced');
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const pcFileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process and compress file client-side
  const processAndCompress = async (file: File, selectedPreset: PresetKey = preset) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, HEIC).');
      return;
    }

    setProcessing(true);
    setCurrentFile(file);

    try {
      const result = await compressImageFile(file, COMPRESSION_PRESETS[selectedPreset]);
      setCompressionResult(result);
    } catch (err) {
      console.error('Erreur lors de la compression:', err);
      alert("Erreur lors de l'optimisation de l'image. Le fichier est peut-être corrompu.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePresetChange = (newPreset: PresetKey) => {
    setPreset(newPreset);
    if (currentFile) {
      processAndCompress(currentFile, newPreset);
    }
  };

  const handlePcFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAndCompress(file);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAndCompress(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAndCompress(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onImageSelected(urlInput.trim());
    resetModal();
    onClose();
  };

  const handleConfirmCompressed = () => {
    if (compressionResult) {
      onImageSelected(compressionResult.dataUrl);
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setCompressionResult(null);
    setCurrentFile(null);
    setUrlInput('');
    setUrlPreview('');
    setProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const curatedPresets = [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900',
  ];

  return (
    <div className="admin-modal-overlay">
      <div
        className="admin-modal-card max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Zap className="w-4 h-4 fill-amber-500/20" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">{title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  Mobile optimisé
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 truncate">
                Compression instantanée pour réseau mobile à Goma
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compression Result Preview View */}
        {compressionResult ? (
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Visual Success Header */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                    Photo Optimisée avec Succès pour Réseau Mobile
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                    -{compressionResult.reductionPercentage}% de données
                  </span>
                </div>
                <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                  L'image originale de{' '}
                  <span className="font-semibold line-through text-stone-400">
                    {formatBytes(compressionResult.originalSize)}
                  </span>{' '}
                  a été réduite à seulement{' '}
                  <span className="font-bold text-emerald-900 bg-emerald-200/60 px-1.5 py-0.5 rounded">
                    {formatBytes(compressionResult.compressedSize)}
                  </span>{' '}
                  sans perte visible de netteté.
                </p>
              </div>
            </div>

            {/* Image Preview & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner flex items-center justify-center">
                <img
                  src={compressionResult.dataUrl}
                  alt="Aperçu compressé"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono">
                  {compressionResult.width} × {compressionResult.height} px
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-sm text-amber-300 text-[10px] font-bold uppercase">
                  {compressionResult.format}
                </div>
              </div>

              {/* Compression Metrics & Presets */}
              <div className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Résolution originale :</span>
                    <span className="font-medium text-stone-900">
                      {compressionResult.originalWidth} × {compressionResult.originalHeight} px
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Résolution optimisée :</span>
                    <span className="font-bold text-stone-900">
                      {compressionResult.width} × {compressionResult.height} px
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Économie bande passante :</span>
                    <span className="font-bold text-emerald-600">
                      {formatBytes(compressionResult.originalSize - compressionResult.compressedSize)}
                    </span>
                  </div>
                </div>

                {/* Preset Switcher */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Niveau d'optimisation réseau :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(COMPRESSION_PRESETS) as PresetKey[]).map((key) => {
                      const p = COMPRESSION_PRESETS[key];
                      const isSelected = preset === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={processing}
                          onClick={() => handlePresetChange(key)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <div className="font-bold text-[11px] truncate">
                            {key === 'balanced' ? 'Équilibré' : key === 'high' ? 'HD' : 'Éco Data'}
                          </div>
                          <div className={`text-[9px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {p.maxWidth}px • {Math.round(p.quality * 100)}%
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end border-t border-stone-200">
              <button
                type="button"
                onClick={resetModal}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
              >
                Choisir une autre photo
              </button>
              <button
                type="button"
                onClick={handleConfirmCompressed}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Insérer cette photo optimisée</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 3 Tabs */}
            <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50 text-[11px] sm:text-xs font-semibold shrink-0">
              <button
                onClick={() => setTab('pc')}
                className={`py-2.5 sm:py-3 px-1 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
                  tab === 'pc'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Fichier PC</span>
              </button>

              <button
                onClick={() => setTab('camera')}
                className={`py-2.5 sm:py-3 px-1 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
                  tab === 'camera'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Caméra</span>
              </button>

              <button
                onClick={() => setTab('url')}
                className={`py-2.5 sm:py-3 px-1 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
                  tab === 'url'
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Link className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Lien URL</span>
              </button>
            </div>

            {/* Mode preset selection banner */}
            <div className="bg-amber-50/60 px-6 py-2.5 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-[11px]">Profil de compression :</span>
              </div>
              <div className="flex items-center gap-1">
                {(Object.keys(COMPRESSION_PRESETS) as PresetKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPreset(key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      preset === key
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {key === 'balanced' ? 'Équilibré (~150k)' : key === 'high' ? 'HD' : 'Éco'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* 1. PC Drag & Drop / File selector */}
              {tab === 'pc' && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => pcFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-stone-900 bg-stone-100 scale-102'
                        : 'border-stone-300 hover:border-stone-400 bg-stone-50/70 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      ref={pcFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePcFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center mx-auto mb-3 text-stone-700">
                      {processing ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-stone-900 mb-1">
                      {processing ? "Compression en cours..." : "Glissez-déposez une photo ici"}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      ou cliquez pour parcourir les dossiers de votre appareil
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-stone-600 font-medium">
                      <span className="px-2 py-0.5 bg-stone-200 rounded">JPG, PNG, WebP</span>
                      <span className="text-emerald-600 font-bold">• Compression auto activée</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Mobile Camera with capture="environment" */}
              {tab === 'camera' && (
                <div className="space-y-4 text-center">
                  <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-3">
                    <Camera className="w-10 h-10 text-amber-600 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold">Prise de Vue Directe sur Smartphone</h4>
                      <p className="text-xs text-amber-900/80 mt-1 max-w-sm mx-auto leading-relaxed">
                        Prenez une photo en rayon avec la caméra de votre téléphone. Elle sera <strong className="font-semibold text-amber-950">automatiquement compressée à ~150 Ko</strong> avant l'enregistrement pour ne pas saturer le stockage et s'afficher instantanément pour vos clients à Goma.
                      </p>
                    </div>

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {processing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Compression de la photo...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4" />
                          <span>Ouvrir l’Appareil Photo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. External Image URL */}
              {tab === 'url' && (
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Lien URL de l’image (Internet)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          setUrlPreview(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/... ou https://votresite.com/photo.jpg"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold"
                      >
                        Valider
                      </button>
                    </div>
                  </div>

                  {urlPreview && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Aperçu du lien :
                      </span>
                      <div className="h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                        <img
                          src={urlPreview}
                          alt="Aperçu"
                          onError={() => setUrlPreview('')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick sample suggestions */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                      Exemples d'images haute définition disponibles :
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {curatedPresets.map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onImageSelected(presetUrl);
                            handleClose();
                          }}
                          className="aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-stone-900 transition-all hover:scale-105"
                          title="Utiliser cette photo"
                        >
                          <img src={presetUrl} alt="Exemple" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {processing && (
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                  <span>Compression & ré-échantillonnage de l'image en cours...</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-stone-500 hidden sm:inline">
                ⚡ Réduction automatique de ~95% du poids de vos photos
              </span>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 ml-auto"
              >
                Annuler
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

