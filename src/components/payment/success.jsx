'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Home, Package, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      setOrderData({
        orderId: orderId,
        productName: 'Nutrimix Pro',
        amount: 'Rp 2.000.000',
        paymentMethod: 'QRIS',
        estimatedDelivery: '3-5 hari kerja',
        orderDate: new Date().toLocaleDateString('id-ID')
      });
    }
  }, [orderId]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3]/20 via-[#F0DCC8]/20 to-[#E8D4C0]/20 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3]/20 via-[#F0DCC8]/20 to-[#E8D4C0]/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/80 rounded-[32px] shadow-2xl border border-white/30 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-600">Terima kasih telah melakukan pemesanan</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gradient-to-r from-[#D4A574]/10 to-[#C19A6B]/10 rounded-2xl p-6 border border-[#D4A574]/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D4A574]" />
                Detail Pesanan
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor Pesanan:</span>
                  <span className="font-medium text-gray-900">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Produk:</span>
                  <span className="font-medium text-gray-900">{orderData.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pembayaran:</span>
                  <span className="font-bold text-lg text-[#D4A574]">{orderData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium text-gray-900">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal Pesan:</span>
                  <span className="font-medium text-gray-900">{orderData.orderDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Informasi Pengiriman
              </h3>
              <p className="text-gray-600 mb-2">
                Pesanan Anda akan segera diproses dan dikirim ke alamat yang telah Anda berikan.
              </p>
              <p className="text-sm text-gray-500">
                Estimasi pengiriman: <span className="font-medium">{orderData.estimatedDelivery}</span>
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-[#D4A574] hover:bg-[#C19A6B] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/6282211511345', '_blank')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Hubungi Support
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}