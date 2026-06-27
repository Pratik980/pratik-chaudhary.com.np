export default function ErrorMessage({ message = 'An error occurred', onRetry }) {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-destructive/10 rounded-full">
          <span className="text-destructive text-lg font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
      </div>
      <p className="text-sm text-muted-foreground bg-accent/30 p-4 rounded">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  )
}
