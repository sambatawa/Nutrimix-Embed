"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/layout';
import Pengaturan from '@/components/dashboard/Pengaturan';

export default function PengaturanPage() {
  const router = useRouter();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);
  
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') : null;
  
  if (isAuthenticated !== 'true') {
    return null;
  }
  
  return (
    <DashboardLayout>
      <Pengaturan />
    </DashboardLayout>
  );
}