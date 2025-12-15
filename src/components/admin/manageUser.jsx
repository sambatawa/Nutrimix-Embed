'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Trash2 } from 'lucide-react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '../../lib/firebase';

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
            joinDate: data.joinDate || new Date().toLocaleDateString('id-ID'),
            orders: data.orders || 0,
            status: data.status || 'active'
          }));
          setUsers(usersData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await set(userRef, {
        ...users.find(u => u.id === userId),
        status: newStatus
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        const userRef = ref(db, `users/${userId}`);
        await remove(userRef);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#6C5F57]">Manajemen Pengguna</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6f66]" />
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C5F57]"></div>
          <span className="ml-3 text-[#6C5F57]">Memuat data pengguna...</span>
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDE6DF]/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Nama</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Tanggal Bergabung</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Pesanan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-[#7d6f66]">
                    {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada data pengguna'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                    <td className="py-3 px-4 text-sm font-medium">{user.id}</td>
                    <td className="py-3 px-4 text-sm">{user.name}</td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.joinDate}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.status}
                        onChange={(e) => handleUpdateUserStatus(user.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.orders}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="mt-6 p-4 bg-white/30 rounded-xl">
          <h3 className="font-medium text-[#6C5F57] mb-3">Statistik Pengguna</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5F57]">{users.length}</p>
              <p className="text-sm text-[#7d6f66]">Total Pengguna</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-sm text-[#7d6f66]">Pengguna Aktif</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {users.filter(u => u.status === 'inactive').length}
              </p>
              <p className="text-sm text-[#7d6f66]">Pengguna Tidak Aktif</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}