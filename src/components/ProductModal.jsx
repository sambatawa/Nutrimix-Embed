'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Package, ShoppingBag, CheckCircle } from 'lucide-react';
import { getAllProducts } from '../lib/firebase';

export const ProductModal = React.memo(function ProductModal({ isOpen, onClose, productId = null }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Indonesia'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        
        if (productId) {
          const product = productsData.find(p => p.id === productId);
          setSelectedProduct(product || productsData[0] || null);
        } else {
          setSelectedProduct(productsData[0] || null);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchProducts();
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    }

    return () => {
      // Re-enable body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen, productId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const defaultOrderingSteps = [
    "Pilih produk yang diinginkan",
    "Isi formulir pemesanan", 
    "Konfirmasi pembayaran",
    "Produk dikirim ke alamat"
  ];

  const handleWhatsApp = () => {
    const phoneNumber = "6282211511345";
    const message = encodeURIComponent(
      "Halo Nutrimix,\n\n" +
      "Saya ingin memesan produk dengan detail berikut:\n\n" +
      `• Produk: ${selectedProduct?.name || 'Produk'}\n` +
      `• Harga: ${selectedProduct ? formatCurrency(selectedProduct.price) : 'Rp 0'}\n` +
      "Mohon informasikan langkah selanjutnya untuk proses pemesanan.\n\n" +
      "Terima kasih."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const validateCustomerForm = () => {
    const errors = {};
    if (!customerData.firstName) errors.firstName = 'Nama depan wajib diisi';
    if (!customerData.email) errors.email = 'Email wajib diisi';
    if (!customerData.phone) errors.phone = 'Nomor telepon wajib diisi';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateCustomerForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerDetails: customerData,
          itemDetails: {
            id: selectedProduct?.id || 'PRODUCT',
            name: selectedProduct?.name || 'Produk',
            price: selectedProduct?.price || 0,
            quantity: 1
          }
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Payment processing failed');
      }
      
      if (window.snap) {
        window.snap.pay(result.snapToken, {
          onSuccess: window.snapCallback.onSuccess,
          onPending: window.snapCallback.onPending,
          onError: window.snapCallback.onError,
          onClose: window.snapCallback.onClose
        });
      } else {
        throw new Error('Midtrans Snap not loaded');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_CLIENT_KEY');
    script.async = true;
    document.body.appendChild(script);

    window.snapCallback = {
      onSuccess: function(result) {
        console.log('Payment success:', result);
        setIsProcessing(false);
        alert('Pembayaran berhasil! Terima kasih atas pesanan Anda.');
        onClose();
      },
      onPending: function(result) {
        console.log('Payment pending:', result);
        setIsProcessing(false);
        alert('Pembayaran sedang diproses. Silakan lanjutkan pembayaran.');
      },
      onError: function(result) {
        console.log('Payment error:', result);
        setIsProcessing(false);
        alert('Pembayaran gagal. Silakan coba lagi.');
      },
      onClose: function() {
        setIsProcessing(false);
        console.log('Customer closed the popup without finishing the payment');
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.snapCallback;
    };
  }, [onClose]);

  if (!isOpen || loading || !selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-linear-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-t-[50px] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/30 md:max-h-[90vh] md:overflow-hidden overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {products.length > 1 && (
              <div className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => {
                      const currentIndex = products.findIndex(p => p.id === selectedProduct?.id);
                      const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
                      setSelectedProduct(products[newIndex]);
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                  </button>
                  <div className="flex items-center justify-center gap-2 px-8">
                    {products.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedProduct?.id === product.id
                            ? 'bg-[#D4A574] w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Pilih ${product.name}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const currentIndex = products.findIndex(p => p.id === selectedProduct?.id);
                      const newIndex = currentIndex === products.length - 1 ? 0 : currentIndex + 1;
                      setSelectedProduct(products[newIndex]);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-linear-to-br from-[#F5E6D3]/80 to-[#E8D4C0]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30">
                  <img 
                    src={selectedProduct.image || '/1.png'} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23F5E6D3' width='400' height='400'/%3E%3Ctext fill='%238B5A2B' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E${selectedProduct.name || 'Produk'}%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="backdrop-blur-md bg-linear-to-r from-[#D4A574]/90 to-[#C19A6B]/90 text-white p-4 rounded-2xl border border-white/50">
                  <p className="text-sm opacity-90">Harga</p>
                  <p className="text-3xl font-bold">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2">
                    <h2 className="text-4xl font-black bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <div className="h-1 w-20 bg-linear-to-r from-[#D4A574] to-[#C17A4F] rounded-full mt-3"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D4A574]" />
                    Spesifikasi
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-white backdrop-blur-sm">
                    <table className="w-full">
                      <tbody>
                        {selectedProduct.spesifikasi ? (
                          selectedProduct.spesifikasi.split(',').map((spec, index) => {
                            const [label, value] = spec.trim().split(':');
                            return (
                              <tr key={index} className="border-b border-white/10 last:border-b-0">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-linear-to-r from-[#F5E6D3]/50 to-[#E8D4C0]/50 w-2/5">
                                  {label?.trim() || ''}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 bg-linear-to-r from-[#F5E6D3]/30 to-[#E8D4C0]/30 w-3/5">
                                  {value?.trim() || ''}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-center">
                              Tidak ada spesifikasi tersedia
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4A574]" />
                    Cara Pemesanan
                  </h3>
                  <ol className="space-y-2">
                    {defaultOrderingSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-[#D4A574] text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <div className="bg-white/30 rounded-full p-6 border border-white/20 shadow-xl">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWhatsApp}
                        className="flex-1 bg-linear-to-r from-[#C17A4F]/80 to-[#B8734A]/40 border-l-2 hover:from-[#B8734A]/90 hover:to-[#9B6540]/90 text-white px-2 py-4 rounded-l-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group"
                      >
                        <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Phone className="w-3 h-3" />
                        </div>
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs">Hubungi WhatsApp</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCustomerForm(true)}
                        disabled={isProcessing}
                        className="flex-1 bg-linear-to-r from-[#D4A574]/40 to-[#C17A4F]/90 border-r-2 hover:from-[#C17A4F]/90 hover:to-[#B8734A]/90 text-white px-2 py-4 rounded-r-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group"
                      >
                        <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-3 h-3" />
                        </div>
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs">{isProcessing ? 'Memproses...' : 'Bayar Sekarang'}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showCustomerForm && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 right-8 bg-linear-to-r from-[#F59E0B] to-[#D97706] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
              >
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Berhasil ditambahkan!</p>
                  <p className="text-sm opacity-90">{selectedProduct.name} telah ditambahkan ke keranjang</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});