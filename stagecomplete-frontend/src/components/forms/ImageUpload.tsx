import React, { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ArtistMedia } from "../../types";

interface ImageUploadProps {
  label: string;
  // Nouveau mode API avec médias gérés via backend
  artistPageId?: number;
  initialPhotos?: ArtistMedia[];
  // Mode legacy avec base64
  value?: string[];
  // Propriétés communes
  maxImages?: number;
  className?: string;
  error?: string;
  apiBase?: string;
  token?: string;
  onChange?: (photos: ArtistMedia[] | string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  artistPageId,
  initialPhotos,
  value,
  maxImages = 6,
  className = "",
  error,
  apiBase,
  token,
  onChange,
}) => {
  const API = apiBase ?? import.meta.env.VITE_API_URL;
  const auth = token ?? localStorage.getItem("token") ?? "";
  const [photos, setPhotos] = useState<ArtistMedia[]>(initialPhotos ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode legacy : gestion base64 direct
  const isLegacyMode = Boolean(value && !artistPageId);

  const handleLegacyFileSelect = async (files: File[]) => {
    if (!value || !onChange) return;

    // Vérifier la limite d'images
    if (value.length + files.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of files) {
        // Conversion basique en base64 (remplace le service artistService)
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }

      // Ajouter les nouvelles images
      onChange([...value, ...newImages] as string[]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Erreur lors du téléchargement des images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeLegacyImage = (index: number) => {
    if (!value || !onChange) return;
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages as string[]);
  };

  const reorderLegacyImages = (fromIndex: number, toIndex: number) => {
    if (!value || !onChange) return;
    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages as string[]);
  };

  const toAbsolute = (maybeUrl?: string | null) => {
    if (!maybeUrl) return "";
    if (maybeUrl.startsWith("http")) return maybeUrl;
    return `${API.replace(/\/$/, "")}/${maybeUrl.replace(/^\//, "")}`;
  };

  // Charger les photos existantes si pas de initialPhotos
  useEffect(() => {
    if (initialPhotos || !artistPageId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsUploading(true);
        const res = await fetch(
          `${API}/artist-page/${artistPageId}/medias?type=PHOTO`,
          { headers: { Authorization: `Bearer ${auth}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setPhotos(data as ArtistMedia[]);
          onChange?.(data as ArtistMedia[]);
        }
      } finally {
        if (!cancelled) setIsUploading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API, artistPageId, auth, initialPhotos, onChange]);

  // Mettre à jour les photos quand initialPhotos change
  useEffect(() => {
    if (initialPhotos) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (isLegacyMode) {
      return handleLegacyFileSelect(files);
    }

    const file = files[0];
    if (!artistPageId) return;

    // Vérifier la limite d'images
    if (photos.length >= maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
      return;
    }

    try {
      setApiError(null);
      setIsUploading(true);

      // 1) Upload binaire → /files
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch(`${API}/files?gallery=1`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth}` },
        body: fd,
      });
      const uploadJson = await uploadRes.json().catch(() => null);
      if (!uploadRes.ok) throw new Error(uploadJson?.message || "Upload impossible");

      // L'API /files peut renvoyer { id, url }
      const fileUrl = toAbsolute(
        uploadJson?.url ?? uploadJson?.path ?? uploadJson?.id
      );

      // 2) Créer le media → POST /artist-page/:id/medias
      const createRes = await fetch(`${API}/artist-page/${artistPageId}/medias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({
          type: "PHOTO",
          url: fileUrl,
          title: file.name,
          isPublic: true,
        }),
      });
      const created = await createRes.json().catch(() => null);
      if (!createRes.ok)
        throw new Error(created?.message || "Création media échouée");

      const newPhotos = [...photos, created].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );
      setPhotos(newPhotos);
      onChange?.(newPhotos);

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setApiError(err.message || "Erreur pendant l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (mediaId: number) => {
    if (!confirm("Supprimer cette photo ?") || !artistPageId) return;
    try {
      setIsUploading(true);
      const res = await fetch(
        `${API}/artist-page/${artistPageId}/medias/${mediaId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${auth}` } }
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Suppression impossible");
      }
      const newPhotos = photos.filter((p) => p.id !== mediaId);
      setPhotos(newPhotos);
      onChange?.(newPhotos);
    } catch (e: any) {
      setApiError(e.message || "Erreur lors de la suppression");
    } finally {
      setIsUploading(false);
    }
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const newPhotos = [...photos];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
    setPhotos(newPhotos);
    onChange?.(newPhotos);
  };

  const saveOrder = async () => {
    if (!artistPageId) return;
    try {
      setIsUploading(true);
      const ordered = photos.map((p, idx) => ({ id: p.id, sortOrder: idx }));
      const res = await fetch(
        `${API}/artist-page/${artistPageId}/medias/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({ items: ordered }),
        }
      );
      if (!res.ok) throw new Error("Impossible d'enregistrer l'ordre");
    } catch (e: any) {
      setApiError(e.message || "Erreur d'enregistrement");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibility = async (media: ArtistMedia) => {
    if (!artistPageId) return;
    try {
      setIsUploading(true);
      const res = await fetch(
        `${API}/artist-page/${artistPageId}/medias/${media.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({ isPublic: !media.isPublic }),
        }
      );
      if (!res.ok) throw new Error("Mise à jour visibilité impossible");
      const newPhotos = photos.map((p) =>
        p.id === media.id ? { ...p, isPublic: !p.isPublic } : p
      );
      setPhotos(newPhotos);
      onChange?.(newPhotos);
    } catch (e: any) {
      setApiError(e.message || "Erreur d'édition");
    } finally {
      setIsUploading(false);
    }
  };

  const currentImages = isLegacyMode ? (value || []) : photos;
  const canAdd = currentImages.length < maxImages;

  return (
    <div className={`${isLegacyMode ? 'form-control w-full' : 'card bg-base-100 shadow'} ${className}`}>
      <div className={isLegacyMode ? '' : 'card-body gap-4'}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {isLegacyMode ? (
              <label className="label">
                <span className="label-text font-medium">{label}</span>
                <span className="label-text-alt text-base-content/60">
                  {currentImages.length}/{maxImages}
                </span>
              </label>
            ) : (
              <>
                <h2 className="card-title">{label}</h2>
                <p className="text-sm opacity-70">
                  {currentImages.length}/{maxImages} photo{maxImages > 1 ? "s" : ""} • Ordre
                  personnalisable
                </p>
              </>
            )}
          </div>
          {artistPageId && (
            <div className="card-actions">
              <button
                className="btn btn-outline btn-sm"
                onClick={saveOrder}
                disabled={isUploading}
              >
                Enregistrer l'ordre
              </button>
            </div>
          )}
        </div>

        {(error || apiError) && (
          <div className="alert alert-error">
            <span>{error || apiError}</span>
          </div>
        )}

        {/* Uploader */}
        {!isLegacyMode && (
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered"
              disabled={!canAdd || isUploading}
              onChange={handleFileSelect}
            />
            <span className="text-sm opacity-70">
              {canAdd
                ? `Vous pouvez ajouter ${maxImages - currentImages.length} photo${maxImages - currentImages.length > 1 ? "s" : ""}.`
                : "Limite atteinte."}
            </span>
          </div>
        )}

        {/* Liste des photos */}
        <div className={`grid gap-4 ${isLegacyMode ? 'grid-cols-2 md:grid-cols-3 mb-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {isLegacyMode ? (
            // Mode legacy avec base64
            <>
              {(value || []).map((image, index) => (
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
                      reorderLegacyImages(fromIndex, index);
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
                      onClick={() => removeLegacyImage(index)}
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

              {/* Bouton d'ajout legacy */}
              {canAdd && (
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
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm">Ajouter</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            // Mode nouveau avec API
            <>
              {photos.map((media, idx) => (
                <div key={media.id} className="card bg-base-200">
                  <figure className="aspect-square overflow-hidden">
                    <img
                      src={toAbsolute(media.url)}
                      alt={media.title || "Photo"}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                  <div className="card-body p-3 gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs opacity-70 truncate"
                        title={media.title || "Photo"}
                      >
                        {media.title || "Photo"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs"
                          disabled={idx === 0 || isUploading}
                          onClick={() => movePhoto(idx, -1)}
                          title="Monter"
                        >
                          ↑
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
                          disabled={idx === photos.length - 1 || isUploading}
                          onClick={() => movePhoto(idx, +1)}
                          title="Descendre"
                        >
                          ↓
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={media.isPublic}
                          onChange={() => toggleVisibility(media)}
                        />
                        <span className="label-text text-xs">Public</span>
                      </label>

                      <button
                        className={`btn btn-error btn-xs ${isUploading ? "loading" : ""}`}
                        onClick={() => removeImage(media.id)}
                        disabled={isUploading}
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-full alert">
                  <span>
                    Aucune photo pour l'instant. Ajoutez-en via le bouton ci-dessus.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input file caché pour mode legacy */}
        {isLegacyMode && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        )}

        {/* Instructions */}
        <div className="text-sm text-base-content/60 space-y-1">
          <p>• Formats supportés: JPG, PNG, WebP</p>
          <p>• Taille maximum: 5MB par image</p>
          {maxImages > 1 && isLegacyMode && <p>• Glissez-déposez pour réorganiser</p>}
          {maxImages > 1 && !isLegacyMode && <p>• Utilisez les boutons ↑/↓ pour réorganiser</p>}
          {maxImages > 1 && (
            <p>• La première image sera votre photo principale</p>
          )}
          {isLegacyMode && (value || []).length > 0 && (
            <p className="text-success">
              • {(value || []).length} image(s) •
              {Math.round(
                (value || []).reduce((total, img) => total + img.length / 1024, 0)
              )}{" "}
              KB total
            </p>
          )}
        </div>

        {/* Error message pour mode legacy */}
        {isLegacyMode && error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    </div>
  );
};
