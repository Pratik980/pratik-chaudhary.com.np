export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
