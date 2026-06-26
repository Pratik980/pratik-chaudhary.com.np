import { useState, useRef } from 'react'
import { uploadImage } from '../lib/uploadImage'
import { Upload, X, Loader2, ExternalLink } from 'lucide-react'

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Image' }) {
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-border bg-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-80 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : (value ? 'Replace' : 'Upload')}
          </button>
          {value && (
            <>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded-md text-sm font-medium hover:bg-destructive/20"
              >
                Remove
              </button>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-accent/30 text-foreground rounded-md text-sm font-medium hover:bg-accent/50"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View
              </a>
            </>
          )}
          {/* Manual URL input */}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste image URL"
            className="px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs w-full max-w-[200px]"
          />
        </div>
      </div>
    </div>
  )
}
