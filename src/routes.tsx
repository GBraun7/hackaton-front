import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layout/Index'
import DashboardLayout from '@/layout/Dashboard'
import Dashboard from '@/pages/dashboard/Index'
import Tickets from '@/pages/tickets/Index'
import Login from '@/pages/login/Index'
import ExampleOne from '@/pages/example-one/Index'
import ExampleTwo from '@/pages/example-two/Index'
import NotFound from '@/pages/not-found/Index'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chamados" element={<Tickets />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="exemplo-1" element={<ExampleOne />} />
          <Route path="exemplo-2" element={<ExampleTwo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
