import { Outlet } from 'react-router-dom'
import Header from '@/components/header/Index'
import Footer from '@/components/footer/Index'

export default function MainLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6">
      <a href="#conteudo" className="sr-only focus:not-sr-only">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="flex-1 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
