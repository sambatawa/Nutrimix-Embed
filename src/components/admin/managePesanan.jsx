"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Eye, Edit } from 'lucide-react';

export default function ManagePesanan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentOrders] = useState([
    {
      id: 'ORD001',
      customer: 'John Doe',
      product: 'Lele Premium',
      amount: 50000,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      product: 'Lele Standard',
      amount: 35000,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 'ORD003',
      customer: 'Bob Johnson',
      product: 'Lele Premium',
      amount: 75000,
      status: 'processing',
      date: '2024-01-13'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#6C5F57]">Manajemen Pesanan</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6f66]" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE6DF]/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">ID Pesanan</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Pelanggan</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Produk</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Jumlah</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Tanggal</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders
              .filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.product.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((order) => (
              <tr key={order.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                <td className="py-3 px-4 text-sm">{order.customer}</td>
                <td className="py-3 px-4 text-sm">{order.product}</td>
                <td className="py-3 px-4 text-sm font-medium">{formatCurrency(order.amount)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{order.date}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}