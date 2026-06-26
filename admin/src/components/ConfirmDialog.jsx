import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 id="confirm-dialog-title" className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:opacity-80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
