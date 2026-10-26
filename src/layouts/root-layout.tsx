import { NavLink, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className='flex h-dvh w-full flex-col'>
      <nav className='shrink-0 px-4 h-12 flex items-center bg-transparent border-b-2'>
        <NavLink to="/" end className='text-xl font-heading hover:opacity-75'>
          MetaloDeals
        </NavLink>
      </nav>

      <main className='flex-1 min-h-0 overflow-y-auto p-4'>
        <Outlet />
      </main>
    </div>
  )
}