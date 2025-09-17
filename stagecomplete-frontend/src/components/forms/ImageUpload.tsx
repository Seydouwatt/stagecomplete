import React, { useState, useRef } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { artistService } from "../../services/artistService";

interface ImageUploadProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  className?: string;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  maxImages = 6,
  className = "",
  error,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Vérifier la limite d'images
    if (value.length + files.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of files) {
        // Valider le fichier
        if (!artistService.validateImageFile(file)) {
          continue; // Le service affiche déjà l'erreur
        }

        // Redimensionner et convertir en base64
        const resizedImage = await artistService.resizeImage(file, 800);
        newImages.push(resizedImage);
      }

      // Ajouter les nouvelles images
      onChange([...value, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Erreur lors du téléchargement des images");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className={`form-control w-full ${className}`}>
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        <span className="label-text-alt text-base-content/60">
          {value.length}/{maxImages}
        </span>
      </label>

      {/* Images grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {value.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square bg-base-200 rounded-lg overflow-hidden"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
              if (fromIndex !== index) {
                reorderImages(fromIndex, index);
              }
            }}
          >
            <img
              src={image}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="btn btn-error btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer l'image"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Badge de position */}
            <div className="absolute top-2 left-2">
              <span className="badge badge-primary badge-sm">{index + 1}</span>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout */}
        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square border-2 border-dashed border-base-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-base-content/60 hover:text-primary"
          >
            {isUploading ? (
              <>
                <div className="loading loading-spinner loading-md"></div>
                <span className="text-sm">Upload...</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-8 h-8" />
                <span className="text-sm">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Instructions */}

      <div className="text-sm text-base-content/60 space-y-1">
        <p>• Formats supportés: JPG, PNG, WebP</p>
        <p>• Taille maximum: 5MB par image</p>
        {maxImages > 1 && <p>• Glissez-déposez pour réorganiser</p>}
        {maxImages > 1 && (
          <p>• La première image sera votre photo principale</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
