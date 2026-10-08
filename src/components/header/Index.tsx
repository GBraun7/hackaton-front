import { NavLink } from 'react-router-dom'
import { navigationItems } from '@/data/navigation.data'

export default function Header() {
  return (
    <header className="border-b border-border py-4">
      <p className="mb-3 font-semibold">Hackathon — Frontend</p>
      <nav aria-label="Navegação principal" className="flex flex-wrap gap-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => isActive ? 'font-semibold underline' : 'underline'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
