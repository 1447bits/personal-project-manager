// app/layout.tsx
'use client'
import ProtectedRoute from '@/app/(components)/auth/ProtectedRoute';
import { queryClient } from '@/app/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from '@/app/(components)/dashboard/DashboardLayout';


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={queryClient}>
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  </QueryClientProvider>
}