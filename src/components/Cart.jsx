'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield, Store, Check, ChevronDown, ChevronUp } from 'lucide-react';

const initialCartItems = [
  {
    id: 1,
    name: 'Nutrimix Premium',
    description: 'Pakan Pelet Ikan Premium',
    type: 'Udang',
    size: '5kg',
    price: 85000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmVlZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seller: {
      id: 'seller1',
      name: 'Nutrimix Official Store',
      rating: 4.8,
      location: 'Jakarta'
    },
    variants: {
      size: '5kg',
      type: 'Udang'
    },
    stock: 50,
    minOrder: 1,
    maxOrder: 10
  },
  {
    id: 2,
    name: 'Nutrimix Grow',
    description: 'Pakan Pembesar Cepat',
    type: 'Lele',
    size: '10kg',
    price: 125000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybXxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seller: {
      id: 'seller1',
      name: 'Nutrimix Official Store',
      rating: 4.8,
      location: 'Jakarta'
    },
    variants: {
      size: '10kg',
      type: 'Lele'
    },
    stock: 30,
    minOrder: 1,
    maxOrder: 5
  },
  {
    id: 3,
    name: 'Nutrimix Starter',
    description: 'Pakan Benih Ikan',
    type: 'Nila',
    size: '2kg',
    price: 45000,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1467003900940-56b9a6a6a1a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwcG9uZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seller: {
      id: 'seller2',
      name: 'AquaFeed Store',
      rating: 4.6,
      location: 'Surabaya'
    },
    variants: {
      size: '2kg',
      type: 'Nila'
    },
    stock: 100,
    minOrder: 2,
    maxOrder: 20
  },
  {
    id: 4,
    name: 'SuperFeed Pro',
    description: 'Pakan Ikan Berkualitas Tinggi',
    type: 'Lele',
    size: '5kg',
    price: 75000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmVlZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seller: {
      id: 'seller2',
      name: 'AquaFeed Store',
      rating: 4.6,
      location: 'Surabaya'
    },
    variants: {
      size: '5kg',
      type: 'Lele'
    },
    stock: 75,
    minOrder: 1,
    maxOrder: 15
  }
];

export function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [savedForLater, setSavedForLater] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [collapsedSellers, setCollapsedSellers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [shippingOptions, setShippingOptions] = useState({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isInRecommendation, setIsInRecommendation] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const recommendationSection = document.getElementById('recommendation-section');
      if (recommendationSection) {
        const rect = recommendationSection.getBoundingClientRect();
        setIsInRecommendation(rect.top <= window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showOrderModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOrderModal]);

  // Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    const sellerId = item.seller.id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller: item.seller,
        items: []
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {});

  const sellers = Object.values(groupedItems);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(item.minOrder || 1, Math.min(item.maxOrder || 999, item.quantity + delta));
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const saveForLater = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedForLater([...savedForLater, item]);
      removeItem(id);
    }
  };

  const moveToCart = (id) => {
    const item = savedForLater.find(item => item.id === id);
    if (item) {
      setCartItems([...cartItems, item]);
      setSavedForLater(savedForLater.filter(item => item.id !== id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectSeller = (sellerId) => {
    const sellerItems = groupedItems[sellerId]?.items || [];
    const sellerItemIds = sellerItems.map(item => item.id);
    
    setSelectedSellers(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
    
    if (selectedSellers.includes(sellerId)) {
      // Deselect all items from this seller
      setSelectedItems(prev => prev.filter(id => !sellerItemIds.includes(id)));
    } else {
      // Select all items from this seller
      setSelectedItems(prev => [...new Set([...prev, ...sellerItemIds])]);
    }
  };

  const selectAllItems = () => {
    setSelectedItems(cartItems.map(item => item.id));
    setSelectedSellers(Object.keys(groupedItems));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setSelectedSellers([]);
  };

  const removeSelectedItems = () => {
    setCartItems(items => items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectedSellers([]);
  };

  const toggleSellerCollapse = (sellerId) => {
    setCollapsedSellers(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      setIsPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      setIsPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 100 ? 0 : 8.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F8F4EF] via-[#F5F0EB] to-[#FAF6F1] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-20 h-20 mx-auto text-[#D4A574]/30 mb-6" />
          <h2 className="text-3xl mb-4 font-bold bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent">Keranjang Belanja Kosong</h2>
          <p className="text-gray-600 mb-8">Tambahkan produk pakan ikan untuk memulai</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-[#D4A574] hover:bg-[#C17A4F] text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Lanjut Belanja
          </button>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8F4EF] via-[#F5F0EB] to-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent">Keranjang Belanja</h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white rounded-full px-3 py-1 shadow-lg flex items-center justify-center"
              style={{ minWidth: '2.5rem', height: '2.5rem' }}
            >
              <span className="text-sm font-bold">{cartItems.length}</span>
            </motion.div>
          </div>
          
        </div>
        <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'produk' : 'produk'} dalam keranjang</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 pb-32">

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#D4A574]/20"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 text-[#D4A574] border-gray-300 rounded focus:ring-[#D4A574] focus:ring-2 mt-1"
                    />
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="shrink-0 w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>

                  <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3">
                        <div>
                          <h3 className="text-xl mb-1 font-semibold">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-[#D4A574]/20 text-[#C17A4F] px-2 py-1 rounded-full text-xs font-medium">
                              {item.type}
                            </span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              {item.size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>


                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center bg-[#D4A574]/10 border border-[#D4A574]/20 rounded-lg">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#D4A574' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-[#D4A574] hover:text-white rounded-l-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                        <div className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')} /{item.size}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
          >
            <div className="bg-linear-to-r from-[#D4A574]/10 to-[#D4A574]/5 rounded-xl p-4 flex items-center gap-3 border border-[#D4A574]/20 shadow-sm">
              <Truck className="w-6 h-6 text-[#D4A574] shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pengiriman Gratis</p>
                <p className="text-xs text-gray-600">Minimal pembelian Rp 500.000</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-[#D4A574]/20 text-[#C17A4F] px-2 py-1 rounded-full text-xs font-medium">
                    Reguler 2-4 hari
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-r from-[#D4A574]/10 to-[#D4A574]/5 rounded-xl p-4 flex items-center gap-3 border border-[#D4A574]/20 shadow-sm">
              <Tag className="w-6 h-6 text-[#D4A574] shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Voucher Tersedia</p>
                <p className="text-xs text-gray-600">Gunakan kode promo untuk diskon</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-[#D4A574]/20 text-[#C17A4F] px-2 py-1 rounded-full font-medium">
                    SAVE20
                  </span>
                  <span className="text-xs bg-[#D4A574]/20 text-[#C17A4F] px-2 py-1 rounded-full font-medium">
                    WELCOME10
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={`lg:col-span-3 transition-all duration-300 ${showOrderModal ? 'blur-sm' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isInRecommendation ? 'sticky border-t-4 border-[#D4A574] shadow-2xl bg-linear-to-r from-white via-[#FEF7F0] to-white' : 'fixed'} bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50 px-6 py-4 transition-all duration-300 ease-in-out`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:hidden gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedItems.length > 0 ? (
                      <span>{selectedItems.length} item dipilih</span>
                    ) : (
                      <span>Pilih item untuk checkout</span>
                    )}
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="text-xl font-bold text-[#D4A574]">
                      Rp {total.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kode promo"
                    disabled={isPromoApplied}
                    className="flex-1 px-3 py-2 border-2 border-[#D4A574]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] disabled:opacity-50 bg-white text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyPromoCode}
                    disabled={isPromoApplied}
                    className="px-4 py-2 bg-linear-to-r from-[#D4A574] to-[#C17A4F] hover:from-[#C17A4F] hover:to-[#B87333] text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg shrink-0"
                  >
                    {isPromoApplied ? 'Digunakan' : 'Gunakan'}
                  </motion.button>
                  {isPromoApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-green-700 text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Kode promo digunakan! Hemat Rp {discountAmount.toLocaleString('id-ID')}
                      </p>
                    </motion.div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={selectedItems.length === cartItems.length ? clearSelection : selectAllItems}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#D4A574] transition-all duration-200"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedItems.length === cartItems.length && cartItems.length > 0
                        ? 'bg-[#D4A574] border-[#D4A574]' 
                        : 'border-gray-300'
                    }`}>
                      {selectedItems.length === cartItems.length && cartItems.length > 0 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedItems.length === cartItems.length && cartItems.length > 0 ? 'Batal Pilih' : 'Pilih Semua'}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeSelectedItems}
                    disabled={selectedItems.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Hapus {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                    </span>
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderModal(true)}
                  disabled={selectedItems.length === 0}
                  className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] hover:from-[#C17A4F] hover:to-[#B87333] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] col-span-2"
                >
                  <span>Lihat Detail ({selectedItems.length})</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    {selectedItems.length > 0 ? (
                      <span>{selectedItems.length} item dipilih</span>
                    ) : (
                      <span>Pilih item untuk checkout</span>
                    )}
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="text-xl font-bold text-[#D4A574]">
                      Rp {total.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kode promo"
                    disabled={isPromoApplied}
                    className="w-32 px-6 py-2 border-2 border-[#D4A574]/20 rounded-full  focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] disabled:opacity-50 bg-white text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyPromoCode}
                    disabled={isPromoApplied}
                    className="px-4 py-2 bg-linear-to-r from-[#D4A574] to-[#C17A4F] hover:from-[#C17A4F] hover:to-[#B87333] text-white rounded-2xl transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                  >
                    {isPromoApplied ? 'Digunakan' : 'Gunakan'}
                  </motion.button>
                  {isPromoApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 right-0 p-1.5 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-green-700 text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Kode promo digunakan! Hemat Rp {discountAmount.toLocaleString('id-ID')}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={selectedItems.length === cartItems.length ? clearSelection : selectAllItems}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#D4A574] transition-all duration-200"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedItems.length === cartItems.length && cartItems.length > 0
                        ? 'bg-[#D4A574] border-[#D4A574]' 
                        : 'border-gray-300'
                    }`}>
                      {selectedItems.length === cartItems.length && cartItems.length > 0 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedItems.length === cartItems.length && cartItems.length > 0 ? 'Batal Pilih' : 'Pilih Semua'}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeSelectedItems}
                    disabled={selectedItems.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Hapus {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOrderModal(true)}
                    disabled={selectedItems.length === 0}
                    className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] hover:from-[#C17A4F] hover:to-[#B87333] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Lihat Detail ({selectedItems.length})</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showOrderModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-linear-to-br from-white via-[#FEF7F0] to-white rounded-3xl shadow-2xl border border-[#D4A574]/20 z-50 max-h-[90vh] overflow-y-auto"
                style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Ringkasan Pesanan</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowOrderModal(false)}
                      className="text-gray-500 hover:text-[#D4A574] p-2 hover:bg-[#FEF7F0] rounded-xl transition-all duration-200 border border-transparent hover:border-[#D4A574]/20 flex items-center justify-center w-8 h-8"
                    >
                      <span className="text-xl font-bold leading-none">×</span>
                    </motion.button>
                  </div>

                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {cartItems.filter(item => selectedItems.includes(item.id)).map(item => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.variants.size} • {item.variants.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x</p>
                        </div>
                      </div>
                    ))}
                  </div>


                  <div className="space-y-3 mb-6 pb-6 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-green-600"
                      >
                        <span>Diskon ({discount}%)</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pengiriman</span>
                      <span>{shipping === 0 ? 'GRATIS' : `Rp ${shipping.toLocaleString('id-ID')}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PPN (11%)</span>
                      <span>Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 rounded-2xl border border-[#D4A574]/30 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">Total Pembayaran</span>
                      <span className="text-2xl font-bold bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                    <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] hover:from-[#C17A4F] hover:to-[#B87333] text-white py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold text-lg"
                  >
                    <span>Proses Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center mb-3">Metode Pembayaran</p>
                    <div className="flex justify-center gap-3">
                      <div className="bg-linear-to-r from-[#D4A574]/10 to-[#D4A574]/5 border border-[#D4A574]/20 px-4 py-2 rounded-lg text-sm font-medium text-[#C17A4F] shadow-sm">
                        GOPAY
                      </div>
                      <div className="bg-linear-to-r from-[#D4A574]/10 to-[#D4A574]/5 border border-[#D4A574]/20 px-4 py-2 rounded-lg text-sm font-medium text-[#C17A4F] shadow-sm">
                        DANA
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      <motion.div
        id="recommendation-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`pb-40 transition-all duration-300 ${showOrderModal ? 'blur-sm' : ''}`}
      >
        <h2 className="text-3xl mb-8 font-bold bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent">Produk Rekomendasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Pelet Ikan Lele',
              description: 'Pakan pelet khusus ikan lele',
              type: 'Lele',
              size: '1kg',
              price: 25000,
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmVlZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
            },
            {
              name: 'Pelet Ikan Nila',
              description: 'Pakan pelet untuk ikan nila',
              type: 'Nila',
              size: '1kg',
              price: 23000,
              image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybXxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
            },
            {
              name: 'Pelet Ikan Mas',
              description: 'Pakan pelet ikan mas berkualitas',
              type: 'Mas',
              size: '1kg',
              price: 27000,
              image: 'https://images.unsplash.com/photo-1467003900940-56b9a6a6a1a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwcG9uZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
            },
            {
              name: 'Pelet Ikan Patin',
              description: 'Pakan pelet untuk ikan patin',
              type: 'Patin',
              size: '1kg',
              price: 26000,
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmVlZHxlbnwxfHx8fDE3NjUyNzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
            }
          ].map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-[#D4A574]/30"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 bg-[#D4A574] hover:bg-[#C17A4F] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4">
                <h3 className="text-lg mb-1 font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#D4A574]/20 text-[#C17A4F] px-2 py-1 rounded-full text-xs font-medium">
                    {product.type}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {product.size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-[#D4A574]">Rp {product.price.toLocaleString('id-ID')}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/cart'}
                    className="bg-[#D4A574] hover:bg-[#C17A4F] text-white px-3 py-1 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    + Keranjang
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
}
