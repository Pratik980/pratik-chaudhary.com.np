import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import DataTable from '../../components/DataTable'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'

const blank = { email: '', phone: '', whatsapp: '', address: '', map_embed_url: '' }

export default function ContactEditor() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('info')
  const [form, setForm] = useState(blank)
  const [submissions, setSubmissions] = useState([])
  const [viewMsg, setViewMsg] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const { data: contactData, isLoading: loading1, isError: error1, error: err1 } = useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_info').select('*').limit(1).maybeSingle()
      return data || blank
    },
  })
  useEffect(() => { if (contactData) setForm(contactData) }, [contactData])

  const { data: subData, isLoading: loading2, isError: error2, error: err2 } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      return data || []
    },
  })
  useEffect(() => { if (subData) setSubmissions(subData) }, [subData])

  if (loading1 || loading2) return <LoadingSpinner text="Loading..." />
  if (error1 || error2) return <ErrorMessage message={(err1 || err2)?.message || 'Failed to load'} />

  const saveInfo = async () => {
    const existing = await supabase.from('contact_info').select('id').limit(1).maybeSingle()
    const { error } = existing.data
      ? await supabase.from('contact_info').update({ ...form, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
      : await supabase.from('contact_info').insert([form])
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['contact-info'] })
    toast.success('Contact info saved!')
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    setViewMsg(null)
    toast.success(`Marked as ${status}`)
  }

  const deleteSubmission = async () => {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    toast.success('Deleted!')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Contact</h1>
      <div className="flex gap-2 border-b border-border">
        <button onClick={() => setTab('info')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'info' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Contact Info</button>
        <button onClick={() => setTab('submissions')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'submissions' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Form Submissions ({submissions.filter(s => s.status === 'new').length})</button>
      </div>

      {tab === 'info' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="space-y-1"><label className="text-sm">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="space-y-1"><label className="text-sm">WhatsApp</label><input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="space-y-1"><label className="text-sm">Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="md:col-span-2 space-y-1"><label className="text-sm">Map Embed URL</label><input type="text" value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="https://www.google.com/maps/embed?pb=..." /></div>
          </div>
          <button onClick={saveInfo} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium"><Save className="w-4 h-4" /> Save Contact Info</button>
        </div>
      )}

      {tab === 'submissions' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'subject', label: 'Subject', render: (v) => v || '-' },
              { key: 'message', label: 'Message', render: (v) => <span className="text-xs text-muted-foreground">{v?.slice(0, 60)}...</span> },
              { key: 'created_at', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
              { key: 'status', label: 'Status', render: (v) => (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  v === 'new' ? 'bg-blue-500/10 text-blue-500' : v === 'read' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                }`}>{v}</span>
              )},
            ]}
            data={submissions}
            onEdit={(row) => setViewMsg(row)}
            onDelete={(row) => setDeleteId(row.id)}
          />
        </div>
      )}

      {viewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewMsg(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Message from {viewMsg.name}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {viewMsg.email}</p>
              <p><strong>Subject:</strong> {viewMsg.subject || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(viewMsg.created_at).toLocaleString()}</p>
              <div className="p-3 bg-accent/30 rounded-lg mt-2">
                <p className="text-foreground whitespace-pre-wrap">{viewMsg.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {viewMsg.status !== 'read' && <button onClick={() => updateStatus(viewMsg.id, 'read')} className="px-3 py-1.5 text-sm bg-yellow-500/10 text-yellow-500 rounded-md">Mark Read</button>}
              {viewMsg.status !== 'replied' && <button onClick={() => updateStatus(viewMsg.id, 'replied')} className="px-3 py-1.5 text-sm bg-green-500/10 text-green-500 rounded-md">Mark Replied</button>}
              <button onClick={() => { setDeleteId(viewMsg.id); setViewMsg(null) }} className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteSubmission} message="Delete this submission?" />
    </div>
  )
}
