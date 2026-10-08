import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layout/Index'
import Home from '@/pages/home/Index'
import ExampleOne from '@/pages/example-one/Index'
import ExampleTwo from '@/pages/example-two/Index'
import NotFound from '@/pages/not-found/Index'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="exemplo-1" element={<ExampleOne />} />
          <Route path="exemplo-2" element={<ExampleTwo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
