'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Package, ShoppingBag, CheckCircle } from 'lucide-react';

export const ProductModal = React.memo(function ProductModal({ isOpen, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
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

  const product = {
    name: "Nutrimix",
    price: "Rp 2.000.000",
    image: "/1.png",
    specifications: [
      "Kapasitas: 50kg/batch",
      "Daya: 220V/2000W",
      "Dimensi: 80x60x120cm",
      "Material: Stainless Steel 304",
      "Garansi: 1 tahun",
      "Formula: 6 menu program"
    ],
    orderingSteps: [
      "Pilih produk yang diinginkan",
      "Isi formulir pemesanan",
      "Konfirmasi pembayaran",
      "Produk dikirim ke alamat"
    ],
  };

  const handleWhatsApp = () => {
    const phoneNumber = "6282211511345";
    const message = encodeURIComponent(
      "Halo Nutrimix,\n\n" +
      "Saya ingin memesan produk Nutrimix Pro dengan detail berikut:\n\n" +
      `• Produk: ${product.name}\n` +
      `• Harga: ${product.price}\n` +
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
            id: 'NUTRIMIX-PRO',
            name: 'Nutrimix Pro',
            price: 2000000,
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
          onSuccess: function(paymentResult) {
            console.log('Payment success:', paymentResult);
            setIsProcessing(false);
            window.location.href = '/payment/success?order_id=' + paymentResult.order_id;
          },
          onPending: function(paymentResult) {
            console.log('Payment pending:', paymentResult);
            setIsProcessing(false);
            alert('Pembayaran sedang diproses. Silakan cek status pembayaran Anda.');
          },
          onError: function(paymentResult) {
            console.log('Payment error:', paymentResult);
            setIsProcessing(false);
            alert('Pembayaran gagal. Silakan coba lagi atau hubungi kami.');
          },
          onClose: function() {
            setIsProcessing(false);
            console.log('Customer closed the popup without finishing the payment');
          }
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
    script.setAttribute('data-client-key', 'YOUR_MIDTRANS_CLIENT_KEY');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen) return null;

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
          className="bg-linear-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-[32px] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/30 md:max-h-[90vh] md:overflow-hidden overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-linear-to-r from-white/95 to-white/90 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between rounded-t-[32px] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-[#D4A574] to-[#C17A4F] rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Detail Produk</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-linear-to-br from-[#F5E6D3]/80 to-[#E8D4C0]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23F5E6D3' width='400' height='400'/%3E%3Ctext fill='%238B5A2B' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENutrimix Pro%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="backdrop-blur-md bg-linear-to-r from-[#D4A574]/90 to-[#C19A6B]/90 text-white p-4 rounded-2xl border border-white/20">
                  <p className="text-sm opacity-90">Harga</p>
                  <p className="text-3xl font-bold">{product.price}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D4A574]" />
                    Spesifikasi
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-white backdrop-blur-sm">
                    <table className="w-full">
                      <tbody>
                        {product.specifications.map((spec, index) => {
                          const [label, value] = spec.split(': ');
                          return (
                            <tr key={index} className="border-b border-white/30 last:border-b-0">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-linear-to-r from-[#F5E6D3]/50 to-[#E8D4C0]/50 backdrop-blur-sm w-2/5 border-r border-white/30">
                                {label}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 bg-linear-to-r from-[#F5E6D3]/30 to-[#E8D4C0]/30 backdrop-blur-sm w-3/5">
                                {value}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4A574]" />
                    Cara Pemesanan
                  </h3>
                  <ol className="space-y-2">
                    {product.orderingSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-[#D4A574] text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWhatsApp}
                    className="flex-1 bg-linear-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>Hubungi WhatsApp</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCustomerForm(true)}
                    disabled={isProcessing}
                    className="flex-1 bg-linear-to-r from-[#D4A574] via-[#C17A4F] to-[#B8734A] hover:from-[#C17A4F] hover:via-[#B8734A] hover:to-[#9B6540] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border border-white/20 disabled:shadow-none"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3" />
                    </div>
                    <span>{isProcessing ? 'Memproses...' : 'Bayar Sekarang'}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});