"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ref, get, db } from "@/lib/firebase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Keranjang", href: "/cart", icon: ShoppingCart },
    { name: "Pengaturan", href: "/pengaturan", icon: User },
  ];

  const adminMenu = [
    { name: "Admin Panel", href: "/admin", icon: Shield },
  ];

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;
        
        const adminsRef = ref(db, 'admins');
        const adminSnapshot = await get(adminsRef);
        
        if (adminSnapshot.exists()) {
          const admins = adminSnapshot.val();
          const admin = Object.values(admins).find(u => u.email === userEmail);
          if (admin) {
            setIsAdmin(true);
          }
        }
      } catch {
      }
    };
    
    checkAdminRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full w-20 bg-white/80 border-r border-[#EDE6DF] backdrop-blur-md shadow-sm p-4 flex flex-col relative z-30"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="tracking-[0.2em] text-[#6C5F57] mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.5rem', fontWeight: '400' }}
      >
        Nutrimix
      </motion.div>

      <nav className="flex flex-col gap-2">
        {menu.map((item, index) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 relative group
                  ${
                    active
                      ? "bg-[#6C5F57] text-white shadow-lg"
                      : "text-[#6C5F57] hover:bg-[#EDE6DF] hover:shadow-md"
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={20} className={active ? "text-white" : ""} />
                </motion.div>
                <span className="absolute left-full ml-3 px-2 py-1 bg-[#6C5F57] text-white text-sm rounded-md whitespace-nowrap font-medium shadow-lg z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                  {item.name}
                </span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#6C5F57] rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Admin Menu Section */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-6 border-t border-[#EDE6DF]/30"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href={adminMenu[0].href}
              className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 relative group
                ${
                  pathname.startsWith(adminMenu[0].href)
                    ? "bg-[#D4A574] text-white shadow-lg"
                    : "text-[#D4A574] hover:bg-[#D4A574]/10 hover:shadow-md"
                }
              `}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield size={20} className={pathname.startsWith(adminMenu[0].href) ? "text-white" : ""} />
              </motion.div>
              <span className="absolute left-full ml-3 px-2 py-1 bg-[#D4A574] text-white text-sm rounded-md whitespace-nowrap font-medium shadow-lg z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                {adminMenu[0].name}
              </span>
              {pathname.startsWith(adminMenu[0].href) && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 bg-[#D4A574] rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        </motion.div>
      )}

      <div className="flex-1" />
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 text-[#6C5F57] hover:bg-red-50 hover:text-red-600 hover:shadow-md w-full group relative"
      >
        <motion.div
          whileHover={{ rotate: -10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LogOut size={20} />
        </motion.div>
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-full ml-3 px-2 py-1 bg-red-600 text-white text-sm rounded-md whitespace-nowrap font-medium shadow-lg z-10"
        >
          Keluar
        </motion.span>
      </motion.button>
    </motion.aside>
  );
}
