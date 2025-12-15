'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, Trash2, DollarSign, ShoppingCart, Users, Download, TrendingUp } from 'lucide-react';
import { getAllProducts, addProductWithImage, deleteProduct, updateProduct } from '../../lib/firebase';

export default function ManageProduct({ onStatsUpdate }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', description: '', spesifikasi: '' });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 2500000,
    totalOrders: 45,
    totalUsers: 120,
    topProducts: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        
        if (onStatsUpdate) {
          onStatsUpdate({
            totalProducts: productsData.length,
            lowStock: productsData.filter(p => p.stock <= 5).length
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [onStatsUpdate]);

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'low-stock': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageUrlChange = (e) => {
    let url = e.target.value;
    
    if (url.startsWith('data:image/')) {
      setProductImage(url);
      setImagePreview(url);
      return;
    }
    
    if (url.includes('ibb.co') && !url.includes('i.ibb.co')) {
      const imageId = url.split('/').pop();
      url = `https://i.ibb.co/${imageId}.jpg`;
    }
    
    setProductImage(url);
    setImagePreview(url);
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock) {
        alert('Mohon lengkapi semua field (nama, harga, stok)');
        return;
      }

      setUploading(true);
      
      const productData = {
        ...newProduct,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: parseInt(newProduct.stock) <= 5 ? 'low-stock' : 'active'
      };

      let imageUrl = productImage || '';
      
      await addProductWithImage(productData, productImage);
      const productsData = await getAllProducts();
      setProducts(productsData);
      
      if (onStatsUpdate) {
        onStatsUpdate({
          totalProducts: productsData.length,
          lowStock: productsData.filter(p => p.stock <= 5).length
        });
      }
      
      setNewProduct({ name: '', price: '', stock: '', category: '', description: '', spesifikasi: '' });
      setProductImage('');
      setImagePreview('');
      setShowAddProductForm(false);
      setUploading(false);
      
      const successMsg = imageUrl ? 'Produk berhasil ditambahkan dengan gambar' : 'Produk berhasil ditambahkan (tanpa gambar)';
      alert(successMsg);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Gagal menambahkan produk');
      setUploading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      description: product.description || '',
      spesifikasi: product.spesifikasi || ''
    });
    setProductImage(product.image || '');
    setImagePreview(product.image || '');
    setShowEditForm(true);
  };

  const handleUpdateProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock) {
        alert('Mohon lengkapi semua field (nama, harga, stok)');
        return;
      }

      setUploading(true);
      
      const productData = {
        ...newProduct,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: parseInt(newProduct.stock) <= 5 ? 'low-stock' : 'active'
      };

      await updateProduct(editingProduct.id, productData);
      const productsData = await getAllProducts();
      setProducts(productsData);
      
      if (onStatsUpdate) {
        onStatsUpdate({
          totalProducts: productsData.length,
          lowStock: productsData.filter(p => p.stock <= 5).length
        });
      }
      
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', stock: '', category: '', description: '', spesifikasi: '' });
      setProductImage('');
      setImagePreview('');
      setShowEditForm(false);
      setUploading(false);
      
      alert('Produk berhasil diperbarui');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Gagal memperbarui produk');
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(productId);
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        
        if (onStatsUpdate) {
          onStatsUpdate({
            totalProducts: updatedProducts.length,
            lowStock: updatedProducts.filter(p => p.stock <= 5).length
          });
        }
        
        alert('Produk berhasil dihapus');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#6C5F57]">Manajemen Produk</h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'products' 
                ? 'bg-[#6C5F57] text-white' 
                : 'bg-white/30 text-[#6C5F57] hover:bg-[#EDE6DF]/50'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Produk
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('reporting')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'reporting' 
                ? 'bg-[#6C5F57] text-white' 
                : 'bg-white/30 text-[#6C5F57] hover:bg-[#EDE6DF]/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Pelaporan
          </motion.button>
          {activeTab === 'products' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddProductForm(!showAddProductForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Produk
            </motion.button>
          )}
        </div>
      </div>

      {showEditForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/30 rounded-xl p-6 border border-[#EDE6DF]/20"
        >
          <h3 className="font-semibold text-[#6C5F57] mb-4">Edit Produk</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama Produk</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="Masukkan nama produk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Keyword</label>
              <input
                type="text"
                value={newProduct.category || ''}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="Masukkan keyword produk (pisahkan dengan koma)"
              />
              <p className="text-xs text-[#7d6f66] mt-1">Contoh: lele, ikan, pakan, murah</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Harga</label>
              <input
                type="number"
                min="0"
                value={newProduct.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setNewProduct({...newProduct, price: value});
                  }
                }}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Stok</label>
              <input
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setNewProduct({...newProduct, stock: value});
                  }
                }}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Spesifikasi Produk</label>
              <textarea
                value={newProduct.spesifikasi}
                onChange={(e) => setNewProduct({...newProduct, spesifikasi: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent h-24 resize-none"
                placeholder="Masukkan spesifikasi produk (ukuran, berat, bahan, dll)"
                rows="3"
              />
              <p className="text-xs text-[#7d6f66] mt-1">Contoh: Ukuran: 30x20x10 cm, Berat: 500g, Bahan: Plastik PP</p>
            </div>
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6C5F57] mb-2">URL Foto Produk</label>
                  <input
                    type="url"
                    value={productImage || ''}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent mb-2"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imagePreview && (
                    <div className="w-full h-32 rounded-xl border border-[#EDE6DF]/30 overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '';
                          setImagePreview('');
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-[#7d6f66] mt-1">Masukkan link URL gambar produk</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#6C5F57] mb-2">Deskripsi</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent h-32 resize-none"
                    placeholder="Masukkan deskripsi produk"
                    rows="5"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateProduct}
                  className="px-6 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
                >
                  Update Produk
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', spesifikasi: '' });
                    setProductImage(null);
                    setImagePreview(null);
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Batal
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {showAddProductForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/30 rounded-xl p-6 border border-[#EDE6DF]/20"
        >
          <h3 className="font-semibold text-[#6C5F57] mb-4">Tambah Produk Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama Produk</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="Masukkan nama produk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Keyword</label>
              <input
                type="text"
                value={newProduct.category || ''}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="Masukkan keyword produk (pisahkan dengan koma)"
              />
              <p className="text-xs text-[#7d6f66] mt-1">Contoh: lele, ikan, pakan, murah</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Harga</label>
              <input
                type="number"
                min="0"
                value={newProduct.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setNewProduct({...newProduct, price: value});
                  }
                }}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Stok</label>
              <input
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setNewProduct({...newProduct, stock: value});
                  }
                }}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#6C5F57] mb-2">Spesifikasi Produk</label>
              <textarea
                value={newProduct.spesifikasi}
                onChange={(e) => setNewProduct({...newProduct, spesifikasi: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent h-24 resize-none"
                placeholder="Masukkan spesifikasi produk (ukuran, berat, bahan, dll)"
                rows="3"
              />
              <p className="text-xs text-[#7d6f66] mt-1">Contoh: Ukuran: 30x20x10 cm, Berat: 500g, Bahan: Plastik PP</p>
            </div>
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6C5F57] mb-2">URL Foto Produk</label>
                  <input
                    type="url"
                    value={productImage || ''}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent mb-2"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imagePreview && (
                    <div className="w-full h-32 rounded-xl border border-[#EDE6DF]/30 overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '';
                          setImagePreview('');
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-[#7d6f66] mt-1">Masukkan link URL gambar produk</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#6C5F57] mb-2">Deskripsi</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent h-32 resize-none"
                    placeholder="Masukkan deskripsi produk"
                    rows="5"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddProduct}
                  className="px-6 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
                >
                  Simpan Produk
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddProductForm(false);
                    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', spesifikasi: '' });
                    setProductImage(null);
                    setImagePreview(null);
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Batal
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.length === 0 ? (
          <div className="md:col-span-2 text-center py-8">
            <Package className="w-16 h-16 mx-auto text-[#7d6f66] mb-4" />
            <p className="text-[#7d6f66]">Belum ada data produk</p>
            <p className="text-sm text-[#7d6f66] mt-2">Klik "Tambah Produk" untuk mulai menambahkan produk</p>
          </div>
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
            >
              <div className="flex items-start gap-3 mb-3">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-[#EDE6DF]/30"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#EDE6DF]/30 rounded-lg flex items-center justify-center border border-[#EDE6DF]/30">
                    <Package className="w-6 h-6 text-[#7d6f66]" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#6C5F57]">{product.name}</h3>
                  <p className="text-sm text-[#7d6f66]">{product.category || 'Tidak ada kategori'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status || 'active'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold text-[#6C5F57]">{formatCurrency(product.price || 0)}</p>
                <p className={`text-sm font-medium ${
                  (product.stock || 0) <= 5 ? 'text-red-500' : 'text-green-500'
                }`}>
                  Stok: {product.stock || 0}
                </p>
              </div>
              {product.description && (
                <p className="text-sm text-[#7d6f66] mb-3 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" /> Hapus
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {activeTab === 'reporting' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#6C5F57] mb-6">Pelaporan Penjualan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#7d6f66]">Total Penjualan</span>
                <DollarSign className="w-5 h-5 text-[#D4A574]" />
              </div>
              <div className="text-2xl font-bold text-[#6C5F57]">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-xs text-green-600 mt-1">+12.5% dari bulan lalu</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#7d6f66]">Total Pesanan</span>
                <ShoppingCart className="w-5 h-5 text-[#D4A574]" />
              </div>
              <div className="text-2xl font-bold text-[#6C5F57]">{stats.totalOrders}</div>
              <div className="text-xs text-green-600 mt-1">+8.2% dari bulan lalu</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#7d6f66]">User Aktif</span>
                <Users className="w-5 h-5 text-[#D4A574]" />
              </div>
              <div className="text-2xl font-bold text-[#6C5F57]">{stats.totalUsers}</div>
              <div className="text-xs text-green-600 mt-1">+15.3% dari bulan lalu</div>
            </motion.div>
          </div>

          <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border border-[#EDE6DF]/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#6C5F57]">Laporan Penjualan</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#6C5F57] text-white rounded-lg hover:bg-[#5a4e47] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-[#7d6f66] border-b border-[#EDE6DF]/30 pb-2">
                <div>Periode</div>
                <div>Produk</div>
                <div>Quantity</div>
                <div>Total</div>
              </div>
              
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="grid grid-cols-4 gap-4 py-3 border-b border-[#EDE6DF]/20 hover:bg-[#EDE6DF]/10 transition-colors rounded-lg"
                >
                  <div className="text-sm text-[#6C5F57]">Nov {item + 10}, 2024</div>
                  <div className="text-sm text-[#6C5F57]">Formula {item}</div>
                  <div className="text-sm text-[#6C5F57]">{10 * item} pcs</div>
                  <div className="text-sm font-medium text-[#D4A574]">{formatCurrency(50000 * item)}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border border-[#EDE6DF]/30">
            <h3 className="text-lg font-semibold text-[#6C5F57] mb-4">Produk Terlaris</h3>
            <div className="space-y-3">
              {products.slice(0, 3).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#D4A574] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#6C5F57]">{product.name}</p>
                      <p className="text-xs text-[#7d6f66]">{product.category || 'Tidak ada kategori'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#6C5F57]">{formatCurrency(product.price || 0)}</p>
                    <p className="text-xs text-[#7d6f66]">Stok: {product.stock || 0}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}