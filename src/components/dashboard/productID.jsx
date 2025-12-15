'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Truck, Shield, ArrowLeft, Heart, Share2, Minus, Plus, Check, Package, Award, Clock, MapPin} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById, addToCart } from '@/lib/firebase';

export default function ProductID() {
  const params = useParams();
  const router = useRouter();
  const getUserId = () => {
    return 'inassamarataqia_gmail_com';
  };
  
  const userId = getUserId();
  const productId = params.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      if (!userId || userId === 'demo-user') {
        router.push('/login');
        return;
      }
      
      const cartItem = {
        productId: product.id || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image: product.image || '',
        stock: product.stock,
        quantity: quantity
      };
      
      await addToCart(userId, cartItem);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const updateQuantity = (delta) => {
    const maxAvailable = Math.min(product?.maxOrder || 10, product?.stock || 50);
    const newQuantity = Math.max(1, Math.min(maxAvailable, quantity + delta));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h2>
          <button onClick={handleBack} className="bg-[#D4A574] hover:bg-[#C17A4F] text-white px-6 py-2 rounded-xl transition-all duration-300">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const images = [product.image]; 

  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBack}
        className="flex items-center space-x-2 bg-[#D4A574] hover:bg-[#C17A4F] text-white px-3 py-3 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-16 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          <div className="flex space-x-4">
            {images.map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-yellow-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  4.5 (128 ulasan)
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-green-600 font-medium">
                {product.stock > 0 ? 'Tersedia' : 'Habis'}
              </span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                Rp {(product.price * quantity).toLocaleString('id-ID')}
              </span>
              <span className="text-lg text-gray-500">
                Rp {product.price.toLocaleString('id-ID')} /Barang
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.stock <= 5 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Stok Terbatas
              </span>
            )}
          </div>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Jumlah</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <motion.button
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <div className="w-16 text-center font-medium">
                  {quantity}
                </div>
                <motion.button
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= (product.maxOrder || 10)}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <span className="text-sm text-gray-500">
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-[#D4A574] hover:bg-[#C17A4F] text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl"
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Ditambahkan</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm">Keranjang</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/cart')}
              className="w-full bg-white border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white py-3 rounded-xl transition-all duration-300 font-medium"
            >
              <span className="text-sm">Lihat Keranjang</span>
            </motion.button>
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white py-3 rounded-xl transition-all duration-300 font-medium">
              <span className="text-sm">Beli Langsung</span>
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl mb-5 p-6 shadow-md"
          >
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Informasi Tambahan</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Dimensi</span>
                <span className="font-medium">{product.spesifikasi?.split(',')[2]?.split(':')[1]?.trim()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Material</span>
                <span className="font-medium">{product.spesifikasi?.split(',')[3]?.split(':')[1]?.trim()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Stok</span>
                <span className="font-medium">{product.stock} pcs</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Formula</span>
                <span className="font-medium">{product.spesifikasi?.split(',')[5]?.split(':')[1]?.trim()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Estimasi Pengiriman</span>
                <span className="font-medium">2-4 hari kerja</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}