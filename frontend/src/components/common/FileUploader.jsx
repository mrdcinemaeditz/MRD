import React, { useState, useRef, useEffect } from 'react';
import { DirectUpload } from '@rails/activestorage';
import { 
  UploadCloud, FileVideo, Image as ImageIcon, X, 
  CheckCircle2, AlertCircle, RefreshCw, Play, Film 
} from 'lucide-react';

export const FileUploader = ({
  type = 'video', // 'video' | 'image'
  label,
  helperText,
  accept,
  maxSizeMB,
  currentUrl,
  onUploadSuccess, // (signedId, blobData, localPreviewUrl) => void
  onRemove,
  disabled = false,
}) => {
  const isVideo = type === 'video';
  const defaultAccept = isVideo ? 'video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm' : 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
  const defaultMaxSize = isVideo ? 500 : 5; // 500MB for video, 5MB for images
  const acceptedFormats = accept || defaultAccept;
  const maxBytes = (maxSizeMB || defaultMaxSize) * 1024 * 1024;

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successSignedId, setSuccessSignedId] = useState(null);

  const fileInputRef = useRef(null);
  const directUploadRef = useRef(null);
  const activeXhrRef = useRef(null);

  useEffect(() => {
    if (currentUrl && !file) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const validateFile = (selectedFile) => {
    setErrorMsg(null);

    // Format validation
    const ext = `.${selectedFile.name.split('.').pop().toLowerCase()}`;
    const validExtensions = isVideo ? ['.mp4', '.mov', '.webm'] : ['.jpg', '.jpeg', '.png', '.webp'];
    const validMimes = isVideo
      ? ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    const matchesExt = validExtensions.includes(ext);
    const matchesMime = validMimes.includes(selectedFile.type);

    if (!matchesExt && !matchesMime && selectedFile.type !== '') {
      setErrorMsg(`Invalid file type (${selectedFile.type || ext}). Accepted formats: ${validExtensions.join(', ')}`);
      return false;
    }

    // Size validation
    if (selectedFile.size > maxBytes) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setErrorMsg(`File is too large (${sizeMB}MB). Maximum allowed size is ${maxSizeMB || defaultMaxSize}MB.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    const localUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(localUrl);

    startDirectUpload(selectedFile, localUrl);
  };

  const startDirectUpload = (uploadFile, localUrl) => {
    setUploading(true);
    setProgress(0);
    setErrorMsg(null);

    // Determine direct uploads endpoint
    const directUploadsUrl = '/rails/active_storage/direct_uploads';

    const customDelegate = {
      directUploadWillCreateBlobWithXHR: (xhr) => {
        activeXhrRef.current = xhr;
      },
      directUploadWillStoreFileWithXHR: (xhr) => {
        activeXhrRef.current = xhr;
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });
      }
    };

    try {
      const upload = new DirectUpload(uploadFile, directUploadsUrl, customDelegate);
      directUploadRef.current = upload;

      upload.create((error, blob) => {
        activeXhrRef.current = null;
        setUploading(false);

        if (error) {
          console.error('Direct Upload failed:', error);
          setErrorMsg(error.message || 'Direct upload to storage failed. Please check network and try again.');
        } else {
          setProgress(100);
          setSuccessSignedId(blob.signed_id);
          if (onUploadSuccess) {
            onUploadSuccess(blob.signed_id, blob, localUrl);
          }
        }
      });
    } catch (err) {
      setUploading(false);
      setErrorMsg(err.message || 'Failed to initialize direct upload');
    }
  };

  const handleCancelUpload = () => {
    if (activeXhrRef.current) {
      activeXhrRef.current.abort();
      activeXhrRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setFile(null);
    setPreviewUrl(currentUrl || null);
    setErrorMsg('Upload cancelled');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    handleCancelUpload();
    setPreviewUrl(null);
    setSuccessSignedId(null);
    setErrorMsg(null);
    if (onRemove) onRemove();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
            {label}
          </label>
          {helperText && <span className="text-[11px] text-zinc-500">{helperText}</span>}
        </div>
      )}

      {/* Upload Zone / Preview */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          dragActive
            ? 'border-[#D4A346] bg-[#D4A346]/10 shadow-lg shadow-[#D4A346]/10'
            : errorMsg
            ? 'border-red-500/50 bg-red-950/10'
            : previewUrl
            ? 'border-zinc-800 bg-[#0A0A0C]'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          disabled={disabled || uploading}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {/* State A: Preview Active */}
        {previewUrl ? (
          <div className="relative group">
            {isVideo ? (
              <div className="relative aspect-video max-h-56 w-full bg-black flex items-center justify-center">
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="relative aspect-video max-h-48 w-full bg-zinc-950 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Overlay Info & Change Controls */}
            <div className="p-3 bg-zinc-900/95 border-t border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {isVideo ? <Film className="w-4 h-4 text-[#D4A346] shrink-0" /> : <ImageIcon className="w-4 h-4 text-[#D4A346] shrink-0" />}
                <span className="text-xs text-zinc-300 font-mono-code truncate">
                  {file ? file.name : 'Current File Attached'}
                </span>
                {file && (
                  <span className="text-[10px] text-zinc-500 shrink-0">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                )}
                {successSignedId && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* State B: Empty Drop Zone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#D4A346] group-hover:scale-110 transition-transform">
              {isVideo ? <FileVideo className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Drag & drop your {isVideo ? 'video' : 'thumbnail image'} here, or{' '}
                <span className="text-[#F5C869] hover:underline">browse</span>
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {isVideo
                  ? 'Supports MP4, MOV, WEBM (Max 500 MB)'
                  : 'Supports JPG, PNG, WEBP (Max 5 MB)'}
              </p>
            </div>
          </div>
        )}

        {/* Uploading Progress Bar Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20">
            <div className="w-full max-w-xs space-y-3 text-center">
              <div className="flex items-center justify-between text-xs text-zinc-300 font-mono-code">
                <span>Uploading directly to storage...</span>
                <span className="text-[#F5C869] font-bold">{progress}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-[1px] border border-zinc-700">
                <div
                  className="h-full bg-gold-gradient rounded-full transition-all duration-200 shadow-sm shadow-[#D4A346]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-medium transition-colors"
                >
                  Cancel Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
