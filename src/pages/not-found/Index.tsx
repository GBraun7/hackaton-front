import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="space-y-4">
      <h1 id="page-title" className="text-2xl font-semibold">Página não encontrada</h1>
      <p>Este endereço não existe.</p>
      <Link to="/" className="underline">Voltar ao início</Link>
    </section>
  )
}
