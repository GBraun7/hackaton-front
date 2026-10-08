import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ExampleOne() {
  const [text, setText] = useState('')
  const [submittedText, setSubmittedText] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedText(text.trim())
  }

  return (
    <section aria-labelledby="page-title" className="space-y-4">
      <h1 id="page-title" className="text-2xl font-semibold">Exemplo 1</h1>
      <p>Digite um texto para testar os componentes da interface.</p>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="example-text">Texto de exemplo</Label>
          <Input
            id="example-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Digite algo"
          />
        </div>
        <Button type="submit" disabled={!text.trim()}>Mostrar texto</Button>
      </form>
      <p role="status">{submittedText !== null ? 'Texto informado: ' + submittedText : ''}</p>
    </section>
  )
}
