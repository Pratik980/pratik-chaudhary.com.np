import { cn } from '../lib/utils'

export default function StatCard({ icon: Icon, label, value, className }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 flex items-center gap-4", className)}>
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
