// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
