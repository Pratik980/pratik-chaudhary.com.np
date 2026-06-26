import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import DataTable from '../../components/DataTable'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function ContactSubmissions() {
  const queryClient = useQueryClient()
  const [submissions, setSubmissions] = useState([])
  const [viewMsg, setViewMsg] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const { data } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      return data || []
    },
  })
  useEffect(() => { if (data) setSubmissions(data) }, [data])

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    if (viewMsg?.id === id) setViewMsg({ ...viewMsg, status })
    toast.success(`Marked as ${status}`)
  }

  const deleteSubmission = async () => {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    toast.success('Deleted!')
  }

  const bulkDelete = async () => {
    const ids = Array.from(selectedIds)
    for (const id of ids) {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
      if (error) return toast.error(error.message)
    }
    setSelectedIds(new Set())
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    toast.success(`Deleted ${ids.length} submissions`)
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date']
    const rows = submissions.map(s => [s.name, s.email, s.subject || '', s.message.replace(/"/g, '""'), s.status, new Date(s.created_at).toISOString()])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'contact-submissions.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button onClick={bulkDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium">
              Delete Selected ({selectedIds.size})
            </button>
          )}
          <button onClick={exportCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
            Export CSV
          </button>
        </div>
      </div>

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
          { key: 'select', label: '', render: (_, row) => (
            <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => {
              const next = new Set(selectedIds)
              next.has(row.id) ? next.delete(row.id) : next.add(row.id)
              setSelectedIds(next)
            }} />
          )},
        ]}
        data={submissions}
        onEdit={(row) => setViewMsg(row)}
        onDelete={(row) => setDeleteId(row.id)}
      />

      {viewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewMsg(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Message from {viewMsg.name}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {viewMsg.email}</p>
              <p><strong>Subject:</strong> {viewMsg.subject || 'N/A'}</p>
              <p><strong>Status:</strong> <span className={`capitalize ${viewMsg.status === 'new' ? 'text-blue-500' : viewMsg.status === 'read' ? 'text-yellow-500' : 'text-green-500'}`}>{viewMsg.status}</span></p>
              <p><strong>Date:</strong> {new Date(viewMsg.created_at).toLocaleString()}</p>
              <div className="p-3 bg-accent/30 rounded-lg mt-2">
                <p className="text-foreground whitespace-pre-wrap">{viewMsg.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
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
