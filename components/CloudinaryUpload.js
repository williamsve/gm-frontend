/**
 * Componente de Upload de Imágenes con Cloudinary
 * 
 * Este componente permite:
 * - Subir imágenes mediante drag & drop
 * - Seleccionar archivos desde el sistema
 * - Previsualizar imágenes antes de subir
 * - Mostrar progreso de subida
 * - Eliminar imágenes subidas
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export default function CloudinaryUpload({
  onUpload,
  onRemove,
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  folder = 'landin',
  className = '',
  disabled = false
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Validar archivo
  const validateFile = useCallback((file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido: ${file.type}`;
    }
    if (file.size > maxSize) {
      return `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB (máximo: ${maxSize / 1024 / 1024}MB)`;
    }
    return null;
  }, [acceptedTypes, maxSize]);

  // Subir archivos con progreso
  const uploadFileWithProgress = useCallback((file, fileId, folder) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Evento de progreso
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({ ...prev, [fileId]: percentComplete }));
        }
      });

      // Evento de carga completa
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (e) {
            reject(new Error('Error al parsear respuesta'));
          }
        } else {
          reject(new Error('Error al subir imagen'));
        }
      });

      // Evento de error
      xhr.addEventListener('error', () => {
        reject(new Error('Error de conexión'));
      });

      // Evento de abort
      xhr.addEventListener('abort', () => {
        reject(new Error('Subida cancelada'));
      });

      xhr.open('POST', '/api/upload/cloudinary');
      xhr.send(formData);
    });
  }, []);

  // Manejar selección de archivos
  const handleFiles = useCallback(async (selectedFiles) => {
    setError(null);
    const fileArray = Array.from(selectedFiles);

    // Validar cantidad máxima
    if (multiple && files.length + fileArray.length > maxFiles) {
      setError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    // Validar cada archivo
    const validFiles = [];
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    // Subir archivos
    setUploading(true);
    const uploadedFiles = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = `${Date.now()}-${i}`;

      try {
        // Actualizar progreso inicial
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Subir con progreso
        const result = await uploadFileWithProgress(file, fileId, folder);

        // Actualizar progreso final
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

        // Agregar a archivos subidos
        uploadedFiles.push({
          id: fileId,
          public_id: result.public_id,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          name: file.name
        });

        // Notificar al padre
        if (onUpload) {
          onUpload(result);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError(`Error al subir ${file.name}: ${err.message}`);
      }
    }

    // Actualizar estado
    setFiles(prev => [...prev, ...uploadedFiles]);
    setUploading(false);
    setUploadProgress({});
  }, [files.length, maxFiles, multiple, validateFile, folder, onUpload, uploadFileWithProgress]);

  // Manejar drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [disabled, uploading, handleFiles]);

  // Manejar clic en input
  const handleChange = useCallback((e) => {
    const { files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
  }, [handleFiles]);

  // Abrir selector de archivos
  const openFileSelector = useCallback(() => {
    if (!disabled && !uploading) {
      inputRef.current?.click();
    }
  }, [disabled, uploading]);

  // Eliminar archivo
  const handleRemove = useCallback(async (fileId, publicId) => {
    try {
      // Eliminar de Cloudinary
      const response = await fetch('/api/upload/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId })
      });

      if (!response.ok) {
        throw new Error('Error al eliminar imagen');
      }

      // Eliminar del estado
      setFiles(prev => prev.filter(f => f.id !== fileId));

      // Notificar al padre
      if (onRemove) {
        onRemove(publicId);
      }
    } catch (err) {
      console.error('Error removing file:', err);
      setError(`Error al eliminar imagen: ${err.message}`);
    }
  }, [onRemove]);

  return (
    <div className={`cloudinary-upload ${className}`}>
      {/* Área de drop */}
      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        <div className="upload-content">
          {uploading ? (
            <div className="uploading-state">
              {/* Indicador de progreso por archivo */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="progress-container">
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="progress-item">
                      <div className="progress-info">
                        <span className="progress-label">
                          {progress === 100 ? '✓ Completado' : `Subiendo... ${progress}%`}
                        </span>
                        <span className="progress-percent">{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${progress === 100 ? 'completed' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {Object.keys(uploadProgress).length === 0 && (
                <>
                  <div className="spinner"></div>
                  <p>Preparando subida...</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="upload-text">
                {dragActive
                  ? 'Suelta las imágenes aquí'
                  : 'Arrastra imágenes aquí o haz clic para seleccionar'}
              </p>
              <p className="upload-hint">
                {multiple ? `Máximo ${maxFiles} archivos` : 'Un archivo'} • 
                Máximo {maxSize / 1024 / 1024}MB • 
                JPEG, PNG, WebP, GIF
              </p>
            </>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {/* Previsualización de archivos */}
      {files.length > 0 && (
        <div className="upload-preview">
          {files.map((file) => (
            <div key={file.id} className="preview-item">
              <div className="preview-image">
                <Image
                  src={file.url}
                  alt={file.name}
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
              <div className="preview-info">
                <p className="preview-name">{file.name}</p>
                <p className="preview-size">
                  {(file.bytes / 1024).toFixed(1)} KB • {file.width}x{file.height}
                </p>
              </div>
              <button
                onClick={() => handleRemove(file.id, file.public_id)}
                className="preview-remove"
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Estilos */}
      <style jsx>{`
        .cloudinary-upload {
          width: 100%;
        }

        .upload-dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
        }

        .upload-dropzone:hover:not(.disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-dropzone.drag-active {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .upload-dropzone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          color: #9ca3af;
        }

        .upload-icon svg {
          width: 100%;
          height: 100%;
        }

        .upload-text {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          margin: 0;
        }

        .upload-hint {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .uploading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .progress-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-item {
          width: 100%;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .progress-label {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .progress-percent {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-fill.completed {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .upload-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          margin-top: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #dc2626;
          font-size: 14px;
        }

        .error-icon {
          font-size: 16px;
        }

        .error-close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #dc2626;
          padding: 0;
          line-height: 1;
        }

        .upload-preview {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .preview-item {
          position: relative;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .preview-image {
          position: relative;
          width: 100%;
          height: 100px;
        }

        .preview-info {
          padding: 8px;
        }

        .preview-name {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-size {
          font-size: 11px;
          color: #6b7280;
          margin: 0;
        }

        .preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-remove:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.8);
        }

        .preview-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
}
