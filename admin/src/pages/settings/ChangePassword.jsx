import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Save, Lock } from 'lucide-react'

export default function ChangePassword() {
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return toast.error('Passwords do not match')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getSession()).data.session?.user?.email || '',
      password: current,
    })
    if (signInError) {
      setLoading(false)
      return toast.error('Current password is incorrect')
    }

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Password changed successfully!')
    setCurrent(''); setPassword(''); setConfirm('')
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-3xl font-bold text-foreground">Change Password</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground" required />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground" required />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" /> {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
