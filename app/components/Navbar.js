'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/usuarios', label: 'Usuarios' },
    { href: '/cargos', label: 'Cargos' },
    { href: '/cargos_usuarios', label: 'Cargos Usuarios' },
    { href: '/horarios', label: 'Horarios' },
    { href: '/tickeos', label: 'Tickeos' },
    { href: '/consultas', label: 'Consultas' },
  ]

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-white px-4 py-2 rounded-lg transition-colors font-medium",
                pathname === item.href
                  ? "bg-blue-700 shadow-inner"
                  : "hover:bg-blue-500"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}