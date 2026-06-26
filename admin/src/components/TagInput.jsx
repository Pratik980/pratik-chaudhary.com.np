import { useState } from 'react'
import { X } from 'lucide-react'

export default function TagInput({ value = [], onChange }) {
  const [input, setInput] = useState('')

  const addTag = (tag) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border border-input rounded-md bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-sm">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        placeholder={value.length ? 'Add tag...' : 'Type and press Enter'}
      />
    </div>
  )
}
