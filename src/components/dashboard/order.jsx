'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Truck, CheckCircle, Clock, XCircle, Search, ChevronDown, Eye, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { get, ref, push, set, update, db } from '../../lib/firebase';
import DashboardHeader from './DashboardHeader';

const getStatusConfig = (status) => {
  const configs = {
    'menunggu_pembayaran': {
      color: 'text-yellow-700 bg-yellow-50 border border-yellow-300',
      icon: Clock,
      label: 'Menunggu Pembayaran'
    },
    'diproses': {
      color: 'text-blue-700 bg-blue-50 border border-blue-300',
      icon: Package,
      label: 'Diproses'
    },
    'dikemas': {
      color: 'text-purple-700 bg-purple-50 border border-purple-300',
      icon: Package,
      label: 'Dikemas'
    },
    'dikirim': {
      color: 'text-orange-700 bg-orange-50 border border-orange-300',
      icon: Truck,
      label: 'Dikirim'
    },
    'selesai': {
      color: 'text-green-700 bg-green-50 border border-green-300',
      icon: CheckCircle,
      label: 'Selesai'
    },
    'dibatalkan': {
      color: 'text-red-700 bg-red-50 border border-red-300',
      icon: XCircle,
      label: 'Dibatalkan'
    }
  };
  return configs[status] || configs['menunggu_pembayaran'];
};

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const userId = email.replace(/[@.]/g, '_');
      
      const ordersRef = ref(db, `orders/${userId}`);
      const ordersSnapshot = await get(ordersRef);
      
      if (ordersSnapshot.exists()) {
        const ordersData = Object.values(ordersSnapshot.val());
        setOrders(ordersData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else {
        const cartRef = ref(db, `carts/${userId}`);
        const cartSnapshot = await get(cartRef);
        
        if (cartSnapshot.exists()) {
          const cartItems = Object.values(cartSnapshot.val());
          if (cartItems.length > 0) {
            const newOrder = {
              id: `ORD-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              status: 'menunggu_pembayaran',
              items: cartItems,
              total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              paymentMethod: 'QRIS (GoPay)',
              estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            
            await set(ref(db, `orders/${userId}/${newOrder.id}`), newOrder);
            setOrders([newOrder]);
            
            await set(ref(db, `carts/${userId}`), null);
          } else {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const userId = email.replace(/[@.]/g, '_');
      const orderRef = ref(db, `orders/${userId}/${orderId}`);
      const orderSnapshot = await get(orderRef);
      
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.val();
        const updatedOrder = { ...orderData, status: newStatus };
        
        if (newStatus === 'dikirim' && !orderData.trackingNumber) {
          updatedOrder.trackingNumber = `TRK${Date.now().toString().slice(-9)}`;
        }
        
        await update(orderRef, updatedOrder);
        
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const cancelOrder = async (orderId, reason = 'Dibatalkan oleh pengguna') => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const userId = email.replace(/[@.]/g, '_');
      const orderRef = ref(db, `orders/${userId}/${orderId}`);
      const orderSnapshot = await get(orderRef);
      
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.val();
        
        await update(orderRef, {
          status: 'dibatalkan',
          cancelReason: reason
        });
        
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'dibatalkan', cancelReason: reason }
              : order
          )
        );

        const cartRef = ref(db, `carts/${userId}`);
        const cartSnapshot = await get(cartRef);
        
        let existingCart = {};
        if (cartSnapshot.exists()) {
          existingCart = cartSnapshot.val();
        }
        
        orderData.items.forEach(item => {
          const itemKey = `${item.name}_${item.price}`;
          if (existingCart[itemKey]) {
            existingCart[itemKey].quantity += item.quantity;
          } else {
            existingCart[itemKey] = { ...item };
          }
        });
        
        await set(cartRef, existingCart);

        alert('Pesanan berhasil dibatalkan. Barang telah dikembalikan ke keranjang.');
        
        setShowOrderDetail(false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Gagal membatalkan pesanan. Silakan coba lagi.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getProgressPercent = (status) => {
    const progressMap = {
      'menunggu_pembayaran': 0,
      'diproses': 33,
      'dikirim': 66,
      'selesai': 100
    };
    return progressMap[status] || 0;
  };

  const latestShippedOrder = orders
    .filter(o => ['menunggu_pembayaran', 'diproses', 'dikirim', 'selesai'].includes(o.status))
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const currentTrackerStatus = latestShippedOrder?.status || 'diproses';
  const progressPercent = getProgressPercent(currentTrackerStatus);

  if (!mounted) return null;

  return (
    <div>
      <DashboardHeader />
      <div className="p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-[#6C5F57] mb-2">Pesanan</h2>
          <p className="text-[#8B7D77]">Kelola dan lacak semua pesanan Anda</p>
        </motion.div>

      {latestShippedOrder && (
        <div className="bg-white/50 backdrop-blur-sm border-b border-[#EDE6DF]/30 mb-8 rounded-3xl">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-sm font-semibold text-[#D4A574] flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Posisi Paket Terakhir
            </h3>
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-[#EDE6DF] rounded-full"></div>
                <div
                  className="absolute top-5 left-0 h-1 bg-linear-to-r from-[#D4A574] to-[#C17A4F] rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>

                <div className="relative flex justify-between">
                  {[
                    { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran', completed: progressPercent >= 0, time: '15 Des, 10:00' },
                    { key: 'diproses', label: 'Diproses', completed: progressPercent >= 33, time: '15 Des, 14:30' },
                    { key: 'dikirim', label: 'Dikirim', completed: progressPercent >= 66, time: '16 Des, 09:00' },
                    { key: 'selesai', label: 'Selesai', completed: progressPercent === 100, time: 'Est. 17 Des' }
                  ].map((step, index) => {
                    const isActive = step.key === currentTrackerStatus;
                    const isCompleted = step.completed;

                    return (
                      <div key={step.key} className="flex flex-col items-center w-1/4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[#D4A574] border-[#C17A4F] text-white shadow-md'
                            : isActive
                              ? 'bg-white border-[#D4A574] text-[#D4A574] shadow-md'
                              : 'bg-white border-[#EDE6DF] text-[#8B7D77]'
                          }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p className={`text-xs font-semibold whitespace-nowrap ${isCompleted ? 'text-[#6C5F57]' : 'text-[#8B7D77]'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-[#8B7D77] mt-1 hidden sm:block">{step.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#FFF1E5]/70 rounded-xl border border-[#D4A574]/30 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-[#C17A4F]" />
                    <div>
                      <p className="text-sm font-semibold text-[#6C5F57]">{getStatusConfig(currentTrackerStatus).label}</p>
                      <p className="text-xs text-[#8B7D77]">
                        {currentTrackerStatus === 'dikirim' && `Estimasi tiba: ${new Date(latestShippedOrder.estimatedDelivery).toLocaleDateString('id-ID')}`}
                        {currentTrackerStatus === 'selesai' && `Telah diterima pada: ${new Date(latestShippedOrder.date).toLocaleDateString('id-ID')}`}
                      </p>
                    </div>
                  </div>
                  {latestShippedOrder.trackingNumber && (
                    <button
                      onClick={() => handleOrderDetail(latestShippedOrder)}
                      className="flex items-center text-xs font-medium text-[#D4A574] hover:text-[#C17A4F] transition-colors"
                    >
                      Lacak Detail <ChevronDown className="w-3 h-3 ml-1 transform rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-md border-b border-[#EDE6DF]/50 sticky rounded-b-3xl mb-4 top-0 z-10">
          <div className="flex space-x-8 px-5 overflow-x-auto">
            {[
                { key: 'all', label: 'Semua' },
                { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
                { key: 'diproses', label: 'Diproses' },
                { key: 'dikirim', label: 'Dikirim' },
                { key: 'selesai', label: 'Selesai' },
                { key: 'dibatalkan', label: 'Dibatalkan' }
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setSelectedStatus(status.key)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedStatus === status.key
                      ? 'border-[#D4A574] text-[#6C5F57] font-semibold'
                      : 'border-transparent text-[#8B7D77] hover:text-[#6C5F57] hover:border-[#D4A574]/50'
                  }`}
                >
                  {status.label}
                </button>
              ))}
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white/50 rounded-xl shadow-inner">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-[#D4A574]"></div>
              <p className="mt-4 text-sm font-medium text-[#6C5F57]">Memuat pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-xl border border-[#EDE6DF] shadow-md">
              <FileText className="mx-auto h-12 w-12 text-[#D4A574]" />
              <h3 className="mt-4 text-lg font-bold text-[#6C5F57]">Tidak ada pesanan</h3>
              <p className="mt-1 text-sm text-[#8B7D77]">Coba ubah filter status atau kata kunci pencarian.</p>
              {selectedStatus !== 'all' && (
                <button onClick={() => setSelectedStatus('all')} className="mt-4 text-sm font-medium text-[#D4A574] hover:text-[#C17A4F] underline">
                  Tampilkan Semua Pesanan
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-[#EDE6DF] hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-5 border-b border-[#EDE6DF]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium text-[#6C5F57]">{order.id}</p>
                            <p className="text-xs text-[#8B7D77]">{new Date(order.date).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} shadow-sm`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-4">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-16 h-16 relative flex shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg border border-[#EDE6DF]"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-[#6C5F57]">{item.name}</h4>
                              <p className="text-xs text-[#8B7D77]">Rp {item.price.toLocaleString('id')} x {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-[#D4A574]">
                              Rp {(item.price * item.quantity).toLocaleString('id')}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EDE6DF]">
                        <div>
                          <p className="text-xs text-[#8B7D77]">Total ({order.items.length} produk)</p>
                          <p className="text-lg font-bold text-[#6C5F57]">Rp {order.total.toLocaleString('id')}</p>
                        </div>
                        <button
                          onClick={() => handleOrderDetail(order)}
                          className="flex items-center gap-2 text-sm font-medium text-[#D4A574] hover:text-[#C17A4F] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
          onUpdateStatus={updateOrderStatus}
          onCancelOrder={cancelOrder}
        />
      )}
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, onCancelOrder }) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalWithFees = order.total + 11000;

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran', completed: true },
      { key: 'diproses', label: 'Diproses', completed: ['diproses', 'dikirim', 'selesai'].includes(currentStatus) },
      { key: 'dikirim', label: 'Dikirim', completed: ['dikirim', 'selesai'].includes(currentStatus) },
      { key: 'selesai', label: 'Selesai', completed: currentStatus === 'selesai' }
    ];
    if (currentStatus === 'dibatalkan') {
      return [{ key: 'dibatalkan', label: 'Dibatalkan', completed: true, icon: XCircle }];
    }
    return steps;
  };

  const statusSteps = getStatusSteps(order.status);

  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 50, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-[#EDE6DF]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#EDE6DF] p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#6C5F57]">Detail Pesanan</h2>
                <p className="text-sm text-[#8B7D77] mt-1 font-mono">{order.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#EDE6DF]/50 rounded-full transition-all duration-300 border border-transparent hover:border-[#EDE6DF]"
              >
                <X className="w-5 h-5 text-[#6C5F57]" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="bg-white p-5 rounded-2xl border border-[#EDE6DF] shadow-md">
              <div className="flex items-center space-x-4 mb-5 pb-3 border-b border-[#EDE6DF]">
                <StatusIcon className={`w-7 h-7 ${statusConfig.color.split(' ')[0]}`} />
                <div>
                  <h3 className="text-lg font-bold text-[#6C5F57]">{statusConfig.label}</h3>
                  <p className="text-sm text-[#8B7D77]">
                    Dipesan pada: {new Date(order.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {order.status !== 'dibatalkan' ? (
                <div className="relative space-y-4 pt-2">
                  {statusSteps.map((step, index) => {
                    const isCurrent = step.key === order.status;
                    const Icon = step.icon || CheckCircle;

                    return (
                      <div key={step.key} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                            step.completed && !isCurrent ? 'bg-[#D4A574] border-[#C17A4F] text-white' :
                            isCurrent ? 'bg-white border-[#D4A574] text-[#D4A574] shadow-md' :
                            'bg-white border-[#EDE6DF] text-[#8B7D77]'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-0.5 grow ${step.completed ? 'bg-[#D4A574]' : 'bg-[#EDE6DF]'} mt-1 mb-1`}></div>
                          )}
                        </div>
                        <div className="flex-1 pt-1 pb-2">
                          <p className={`text-sm font-semibold ${step.completed ? 'text-[#6C5F57]' : 'text-[#8B7D77]'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[#D4A574] font-medium mt-0.5">
                              Status saat ini.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-300">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Alasan pembatalan:</span> {order.cancelReason || 'Tidak diketahui'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EDE6DF] shadow-md">
              <h3 className="font-bold text-[#6C5F57] mb-4 text-lg">Informasi Pengiriman</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#D4A574] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#6C5F57]">Alamat Pengiriman</p>
                    <p className="text-sm text-[#8B7D77]">Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta 12345</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#D4A574] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#6C5F57]">No. Telepon</p>
                    <p className="text-sm text-[#8B7D77]">+62 812-3456-7890</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-start space-x-3 pt-3 border-t border-[#EDE6DF]/50">
                    <Truck className="w-5 h-5 text-[#D4A574] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#6C5F57]">Nomor Resi</p>
                      <div className="flex justify-between items-center w-full">
                        <p className="font-semibold text-[#6C5F57]">{order.trackingNumber}</p>
                        <button className="text-[#D4A574] text-xs font-medium hover:text-[#C17A4F] ml-4">
                          Lacak
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EDE6DF] shadow-md">
              <h3 className="font-bold text-[#6C5F57] mb-4 text-lg">Ringkasan Produk</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 border-b border-[#EDE6DF]/50 pb-4 last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-[#EDE6DF] shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#6C5F57]">{item.name}</h4>
                      <p className="text-xs text-[#8B7D77]">Harga Satuan: Rp {item.price.toLocaleString('id')}</p>
                      <p className="text-xs text-[#8B7D77]">Kuantitas: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#D4A574]">
                      Rp {(item.price * item.quantity).toLocaleString('id')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EDE6DF] shadow-md">
              <h3 className="font-bold text-[#6C5F57] mb-4 text-lg">Rincian Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B7D77]">Metode Pembayaran</span>
                  <span className="font-medium text-[#6C5F57]">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7D77]">Subtotal Produk</span>
                  <span className="text-[#6C5F57]">Rp {order.total.toLocaleString('id')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7D77]">Ongkos Kirim</span>
                  <span className="text-[#6C5F57]">Rp 10.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7D77]">Biaya Layanan</span>
                  <span className="text-[#6C5F57]">Rp 1.000</span>
                </div>
                <div className="border-t border-[#EDE6DF] pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-[#6C5F57]">Total Pembayaran</span>
                    <span className="font-bold text-[#D4A574]">
                      Rp {totalWithFees.toLocaleString('id')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3 pt-4 border-t border-[#EDE6DF]">
              {order.status === 'menunggu_pembayaran' && (
                <>
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'diproses')}
                    className="w-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#C17A4F] hover:to-[#B06A3F] transition-all duration-300 shadow-lg shadow-[#D4A574]/30"
                  >
                    Bayar Sekarang
                  </button>
                  <button 
                    onClick={() => onCancelOrder(order.id)}
                    className="w-full border border-[#D4A574] text-[#D4A574] py-3 px-4 rounded-xl font-semibold hover:bg-[#D4A574]/10 transition-all duration-300"
                  >
                    Batalkan Pesanan
                  </button>
                </>
              )}
              {order.status === 'diproses' && (
                <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30">
                  Lihat Detail Proses
                </button>
              )}
              {order.status === 'dikirim' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'selesai')}
                  className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg shadow-green-500/30"
                >
                  Konfirmasi Pesanan Diterima
                </button>
              )}
              {order.status === 'selesai' && (
                <>
                  <button className="w-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#C17A4F] hover:to-[#B06A3F] transition-all duration-300 shadow-lg shadow-[#D4A574]/30">
                    Beli Lagi (Reorder)
                  </button>
                  <button className="w-full border border-[#EDE6DF] text-[#6C5F57] py-3 px-4 rounded-xl font-semibold hover:bg-[#EDE6DF] transition-all duration-300">
                    Beri Ulasan
                  </button>
                </>
              )}
              {order.status === 'dibatalkan' && (
                <button className="w-full border border-[#EDE6DF] text-[#6C5F57] py-3 px-4 rounded-xl font-semibold hover:bg-[#EDE6DF] transition-all duration-300">
                  Hubungi Dukungan
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
