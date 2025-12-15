"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, ref, get, query, orderByChild, equalTo } from '@/lib/firebase';

export default function DashboardHeader() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false); // track if component mounted
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchUserName(email);
    }
    
    return () => clearInterval(timer);
  }, []);

  const fetchUserName = async (email) => {
    try {
      const adminsRef = ref(db, 'admins');
      const adminSnapshot = await get(adminsRef);
      
      if (adminSnapshot.exists()) {
        const admins = adminSnapshot.val();
        const admin = Object.values(admins).find(u => u.email === email);
        if (admin && admin.name) {
          setUserName(admin.name);
          setUserRole(admin.role || 'admin');
          return;
        }
      }
      
      const usersRef = ref(db, 'users');
      const userSnapshot = await get(usersRef);
      
      if (userSnapshot.exists()) {
        const users = userSnapshot.val();
        const user = Object.values(users).find(u => u.email === email);
        if (user && user.name) {
          setUserName(user.name);
          setUserRole(user.role || 'user');
        }
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    router.push('/login');
  };

  if (!mounted) return null; 

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = time.getHours();
  let greeting = "Malam";
  if (hour >= 4 && hour < 11) greeting = "Pagi";
  else if (hour >= 11 && hour < 15) greeting = "Siang";
  else if (hour >= 15 && hour < 18) greeting = "Sore";

  return (
    <div className="w-full bg-linear-to-r mb-4 from-[#FFF1E5] to-[#FFE8D1] rounded-2xl p-4 flex flex-row justify-between items-center shadow-md font-sans border border-[#EDE6DF]/50">
      <div className="flex flex-col space-y-1">
        <div className="text-2xl sm:text-3xl font-bold text-[#6C5F57] tracking-tight">
          {formattedTime}
        </div>
        <div className="text-sm sm:text-base text-[#8B7D77] font-medium">
          {formattedDate}
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-end space-y-1 mt-2 sm:mt-0">
        <div className="text-lg sm:text-xl font-semibold text-[#6C5F57] text-center sm:text-right">
          {greeting}, <span className="text-[#D4A574]">{userName}</span>
        </div>
        <div className="flex items-center gap-2">
          {userRole && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              userRole === 'admin' 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              {userRole === 'admin' ? 'Admin' : 'User'}
            </span>
          )}
        </div>
        {userEmail && (
          <div className="text-xs sm:text-sm text-[#8B7D77] font-medium text-center sm:text-right hidden sm:block">
            {userEmail}
          </div>
        )}
      </div>
    </div>
  );
}
