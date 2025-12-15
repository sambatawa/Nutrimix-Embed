"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto relative min-h-screen p-6 bg-linear-to-br from-[#FAF6F1] via-[#E7DFD7] to-[#D8CDC3]">
        <div className="relative z-10">
        {children}
        </div>
      </main>
    </div>
  );
}
