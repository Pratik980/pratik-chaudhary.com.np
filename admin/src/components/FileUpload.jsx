import { useState, useRef } from 'react'
import { uploadImage } from '../lib/uploadImage'
import { Upload, X, Loader2, FileText, ExternalLink } from 'lucide-react'

export default function FileUpload({ value, onChange, folder = 'documents', label = 'File', accept = '.pdf' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const getFileName = (url) => {
    if (!url) return ''
    try {
      const parts = url.split('/')
      return decodeURIComponent(parts[parts.length - 1])
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {value ? (
        <div className="rounded-lg border border-border bg-accent/10 overflow-hidden">
          {/* Current file preview */}
          <div className="flex items-center gap-3 p-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{getFileName(value)}</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
              >
                <ExternalLink className="w-3 h-3" /> View current file
              </a>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:opacity-80 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Replace'}
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {uploading && (
            <div className="px-3 pb-3">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg bg-accent/10 cursor-pointer hover:bg-accent/20 hover:border-primary/30 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload {label.toLowerCase()}</span>
              <span className="text-xs text-muted-foreground/60">Accepts: {accept}</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      {/* Manual URL fallback */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">or URL:</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`https://... or /CV.pdf`}
          className="flex-1 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-sm"
        />
      </div>
    </div>
  )
}