'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Star, Truck, Shield } from 'lucide-react';

export default function ModalProduct({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detail Produk</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-64 bg-gray-100">
          <img className="w-full h-full object-cover" src={product.image} alt={product.name}/>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-3">
              <span className="bg-[#D4A574]/20 text-[#C17A4F] px-3 py-1 rounded-full text-sm font-medium">
                {product.type}
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {product.size}
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold text-[#D4A574]">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-500">Harga per {product.size}</div>
          </div>

          {product.seller && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.seller.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{product.seller.rating}</span>
                    <span>•</span>
                    <span>{product.seller.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Stok: {product.stock || 50} {product.size}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Min: {product.minOrder || 1} | Max: {product.maxOrder || 10}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Keunggulan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-[#D4A574]" />
                <span>Pengiriman Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-[#D4A574]" />
                <span>Garansi Kualitas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingBag className="w-4 h-4 text-[#D4A574]" />
                <span>Packing Aman</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-[#D4A574] hover:bg-[#C17A4F] text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingBag className="w-5 h-5" />
              Tambah ke Keranjang
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Tutup
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
