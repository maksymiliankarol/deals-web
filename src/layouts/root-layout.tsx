import { NavLink, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className='flex h-dvh w-full flex-col'>
      <nav className='shrink-0 px-4 h-12 flex items-center gap-2 bg-transparent border-b-2 text-xl font-heading'>
        <a
          href="https://metalogrom.com"
          aria-label="Metalogrom"
          className='hover:opacity-75'
        >
          M
        </a>
        <span aria-hidden="true" className='size-1.5 rounded-full bg-yellow' />
        <NavLink to="/" end className='hover:opacity-75'>
          Deals
        </NavLink>
      </nav>

      <main className='flex-1 min-h-0 overflow-y-auto p-4'>
        <Outlet />
      </main>
    </div>
  )
}