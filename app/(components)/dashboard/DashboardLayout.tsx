// app/components/dashboard/DashboardLayout.tsx

'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  LogOut,
  Menu,
  X,
  Projector
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutGrid size={20} /> },
  { label: 'Calendar', href: '/dashboard/calendar', icon: <Calendar size={20} /> },
  { label: 'projects', href: '/dashboard/projects', icon: <Projector size={20} /> },
  { label: 'Tasks', href: '/dashboard/tasks', icon: <CheckSquare size={20} /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen transition-transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 bg-white border-r w-64
      `}>
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="px-4 py-6 border-b">
            <Link href={"/"}><h1 className="text-xl font-bold">Task Manager</h1></Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm
                  ${pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        p-4 md:ml-64 transition-margin
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}
      `}>
        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mb-4"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}