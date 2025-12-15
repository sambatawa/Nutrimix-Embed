"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/layout';
import ProductID from '@/components/dashboard/productID';

export default function ProductPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router, mounted]);
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    );
  }
  
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (isAuthenticated !== 'true') {
    return null;
  }
  
  return (
    <DashboardLayout>
      <ProductID />
    </DashboardLayout>
  );
}
