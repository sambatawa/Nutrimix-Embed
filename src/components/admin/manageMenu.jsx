'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Beaker, FlaskRound, TestTube, Weight } from 'lucide-react'; // Mengganti DollarSign dengan Weight
import { addFormula, getAllFormulas, deleteFormula, updateFormula } from '../../lib/firebase';

// Fungsi bantuan untuk mendapatkan ikon
const getFormulaIcon = (index) => {
  const icons = [Beaker, FlaskRound, TestTube];
  return icons[index % icons.length];
};

// Skema data formula inti
const initialFormulaState = {
  name: '',
  category: 'biasa', // Tambah kategori default
  total_weight: '', // Dalam string, di-parse ke number saat disimpan
  protein: '',      // Dalam string, di-parse ke number saat disimpan
  fat: '',          // Dalam string, di-parse ke number saat disimpan
  fiber: '',        // Dalam string, di-parse ke number saat disimpan
  ingredients: '',  // String format 'bahan1 berat1,bahan2 berat2'
  steps: []         // Array of objects { material: string, target_weight: number }
};

export default function ManageMenu() {
  const [formulas, setFormulas] = useState([]);
  const [showAddFormulaForm, setShowAddFormulaForm] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFormula, setNewFormula] = useState(initialFormulaState);

  // Mengambil data formula saat komponen dimuat
  useEffect(() => {
    const fetchFormulas = async () => {
      setLoading(true);
      try {
        const formulasData = await getAllFormulas();
        setFormulas(formulasData);
      } catch (error) {
        console.error('Error fetching formulas:', error);
        alert('Gagal mengambil data formula.');
      } finally {
        setLoading(false);
      }
    };
    fetchFormulas();
  }, []);

  // Handler perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormula({ ...newFormula, [name]: value });
  };

  // Fungsi untuk mem-parsing string ingredients menjadi array of objects { material, target_weight }
  const parseIngredients = (ingredientsString) => {
    return ingredientsString.split(',').map(ing => {
      // Mencoba memisahkan materi dan berat (Contoh: 'tepung ikan 100')
      const parts = ing.trim().split(/\s+/); // Memisahkan dengan spasi atau lebih
      let material = '';
      let weight = 0;

      if (parts.length > 1) {
        // Asumsi berat adalah bagian terakhir dan dapat di-parse sebagai angka
        const potentialWeight = parseInt(parts[parts.length - 1]);
        if (!isNaN(potentialWeight)) {
          weight = potentialWeight;
          // Menggabungkan sisa bagian sebagai material (bisa pakai spasi)
          material = parts.slice(0, parts.length - 1).join('_').toLowerCase();
        } else {
          // Jika tidak ada berat yang valid di akhir, anggap seluruhnya adalah material
          material = ing.trim().split(/\s+/).join('_').toLowerCase();
        }
      } else {
        // Jika hanya satu bagian, anggap seluruhnya adalah material
        material = ing.trim().split(/\s+/).join('_').toLowerCase();
      }

      return {
        material: material,
        target_weight: weight
      };
    }).filter(step => step.material && step.target_weight > 0);
  };

  const handleAddFormula = async () => {
    try {
      if (!newFormula.name || !newFormula.total_weight || !newFormula.ingredients) {
        alert('Mohon lengkapi field wajib (Nama Formula, Total Berat, Bahan-bahan)');
        return;
      }
      
      setLoading(true);

      const ingredientSteps = parseIngredients(newFormula.ingredients);

      const formulaData = {
        name: newFormula.name,
        category: newFormula.category,
        total_weight: parseFloat(newFormula.total_weight) || 0,
        protein: parseFloat(newFormula.protein) || 0,
        fat: parseFloat(newFormula.fat) || 0,
        fiber: parseFloat(newFormula.fiber) || 0,
        ingredients: newFormula.ingredients,
        steps: ingredientSteps,
        createdAt: new Date().toISOString()
      };

      await addFormula(formulaData);
      const formulasData = await getAllFormulas();
      setFormulas(formulasData);
      
      setNewFormula(initialFormulaState);
      setShowAddFormulaForm(false);
      
      alert('Formula berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding formula:', error);
      alert('Gagal menambahkan formula');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormula = (formula) => {
    setEditingFormula(formula);
    setNewFormula({
      name: formula.name || '',
      category: formula.category || 'biasa',
      total_weight: formula.total_weight.toString() || '',
      protein: formula.protein.toString() || '',
      fat: formula.fat.toString() || '',
      fiber: formula.fiber.toString() || '',
      ingredients: formula.ingredients || '',
      steps: formula.steps || []
    });
    setShowEditForm(true);
    setShowAddFormulaForm(false); // Pastikan form tambah tertutup
  };

  const handleUpdateFormula = async () => {
    try {
      if (!newFormula.name || !newFormula.total_weight || !newFormula.ingredients) {
        alert('Mohon lengkapi field wajib (Nama Formula, Total Berat, Bahan-bahan)');
        return;
      }

      setLoading(true);
      
      const ingredientSteps = parseIngredients(newFormula.ingredients);

      const formulaData = {
        name: newFormula.name,
        category: newFormula.category,
        total_weight: parseFloat(newFormula.total_weight) || 0, // Konversi gram ke kg
        protein: parseFloat(newFormula.protein) || 0,
        fat: parseFloat(newFormula.fat) || 0,
        fiber: parseFloat(newFormula.fiber) || 0,
        ingredients: newFormula.ingredients, // Simpan juga string aslinya untuk editing
        steps: ingredientSteps,
        updatedAt: new Date().toISOString()
      };

      await updateFormula(editingFormula.id, formulaData);
      const formulasData = await getAllFormulas();
      setFormulas(formulasData);
      
      setEditingFormula(null);
      setNewFormula(initialFormulaState);
      setShowEditForm(false);
      
      alert('Formula berhasil diperbarui');
    } catch (error) {
      console.error('Error updating formula:', error);
      alert('Gagal memperbarui formula');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFormula = async (formulaId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus formula ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await deleteFormula(formulaId);
        const updatedFormulas = formulas.filter(formula => formula.id !== formulaId);
        setFormulas(updatedFormulas);
        alert('Formula berhasil dihapus');
      } catch (error) {
        console.error('Error deleting formula:', error);
        alert('Gagal menghapus formula');
      }
    }
  };

  const renderFormulaForm = (isEdit = false) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/30 rounded-xl p-6 border border-[#EDE6DF]/20 shadow-lg"
    >
      <h3 className="font-semibold text-[#6C5F57] mb-4">{isEdit ? 'Edit Formula' : 'Tambah Formula Baru'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Formula */}
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama Formula <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={newFormula.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            placeholder="Contoh: Formula Pelet Lele Premium"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Total Berat (kg) <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="total_weight"
            value={newFormula.total_weight}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            placeholder="Misal: 1.5"
            required
          />
        </div>

        {/* Protein */}
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Protein (g)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="protein"
            value={newFormula.protein}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            placeholder="Misal: 35"
          />
        </div>

        {/* Fat */}
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Lemak / Fat (g)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="fat"
            value={newFormula.fat}
            onChange={handleInputChange}
            placeholder="Misal: 8"
          />
        </div>

        {/* Fiber */}
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Serat / Fiber (g)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="fiber"
            value={newFormula.fiber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            placeholder="Misal: 12"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Kategori Formula <span className="text-red-500">*</span></label>
          <select
            name="category"
            value={newFormula.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
            required
          >
            <option value="biasa">Formula Biasa</option>
            <option value="hemat">Formula Hemat</option>
          </select>
        </div>

        {/* Bahan-bahan */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#6C5F57] mb-2">Bahan-bahan & Berat <span className="text-red-500">*</span></label>
          <textarea
            name="ingredients"
            value={newFormula.ingredients}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent h-24 resize-none"
            placeholder="Contoh: Tepung Ikan 200, Tepung Kedelai 150, Minyak Ikan 50"
            rows="3"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Format: `nama bahan berat`, pisahkan dengan koma. Berat harus berupa angka.</p>
        </div>
        
        {/* Tombol Aksi */}
        <div className="md:col-span-2 mt-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isEdit ? handleUpdateFormula : handleAddFormula}
              disabled={loading}
              className="px-6 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors disabled:opacity-50"
            >
              {loading ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : (isEdit ? 'Update Formula' : 'Simpan Formula')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                isEdit ? setShowEditForm(false) : setShowAddFormulaForm(false);
                setEditingFormula(null);
                setNewFormula(initialFormulaState);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Batal
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#6C5F57]">Manajemen Formula</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowAddFormulaForm(!showAddFormulaForm);
            setShowEditForm(false); // Tutup form edit jika membuka form tambah
            setNewFormula(initialFormulaState); // Reset state
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Formula
        </motion.button>
      </div>

      {showAddFormulaForm && renderFormulaForm(false)}

      {showEditForm && renderFormulaForm(true)}
      
      {/* Tampilan Daftar Formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && formulas.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 text-center py-8">
                <p className="text-[#7d6f66] flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#6C5F57]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat data formula...
                </p>
            </div>
        ) : formulas.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-8 bg-white/30 rounded-xl">
            <Beaker className="w-16 h-16 mx-auto text-[#7d6f66] mb-4" />
            <p className="text-[#7d6f66]">Belum ada data formula</p>
            <p className="text-sm text-[#7d6f66] mt-2">Klik "Tambah Formula" untuk mulai menambahkan formula</p>
          </div>
        ) : (
          formulas.map((formula, index) => {
            const IconComponent = getFormulaIcon(index);
            return (
              <motion.div
                key={formula.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#EDE6DF]/50 rounded-lg flex items-center justify-center border border-[#EDE6DF]/30 shrink-0">
                    <IconComponent className="w-5 h-5 text-[#7d6f66]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        formula.category === 'hemat' 
                          ? 'bg-[#EDE6DF]/70 text-[#6C5F57]' 
                          : 'bg-[#6C5F57]/20 text-[#6C5F57]'
                      }`}>
                        {formula.category === 'hemat' ? 'Hemat' : 'Biasa'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#6C5F57]">{formula.name}</h3>
                    <div className="flex items-center text-sm text-[#7d6f66]">
                       <Weight className="w-3 h-3 mr-1" />
                       Total Berat: {formula.total_weight} kg
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center border-t border-b border-[#EDE6DF] py-2 mb-3">
                    <div className="p-1 bg-[#EDE6DF]/50 rounded-lg">
                        <p className="text-xs font-semibold text-[#6C5F57]">Protein</p>
                        <p className="text-sm text-green-700 font-bold">{formula.protein || 0}g</p>
                    </div>
                    <div className="p-1 bg-[#EDE6DF]/50 rounded-lg">
                        <p className="text-xs font-semibold text-[#6C5F57]">Lemak</p>
                        <p className="text-sm text-amber-700 font-bold">{formula.fat || 0}g</p>
                    </div>
                    <div className="p-1 bg-[#EDE6DF]/50 rounded-lg">
                        <p className="text-xs font-semibold text-[#6C5F57]">Serat</p>
                        <p className="text-sm text-blue-700 font-bold">{formula.fiber || 0}g</p>
                    </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs font-medium text-[#6C5F57] mb-1">Bahan-bahan ({formula.steps ? formula.steps.length : 0} item):</p>
                  <ul className="text-xs text-[#7d6f66] list-disc list-inside ml-2 max-h-16 overflow-y-auto">
                    {formula.steps && formula.steps.map((step, i) => (
                        <li key={i}>{step.material.replace(/_/g, ' ')} ({step.target_weight}g)</li>
                    ))}
                    {!formula.steps || formula.steps.length === 0 && (
                        <li className="text-red-500">Data bahan tidak valid/lengkap.</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex items-center gap-2 border-t border-[#EDE6DF] pt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditFormula(formula)}
                    className="flex-1 flex items-center justify-center p-2 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1" /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteFormula(formula.id)}
                    className="flex-1 flex items-center justify-center p-2 text-red-600 bg-red-50/50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" /> Hapus
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}