import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { BRAND_MODELS, MOCK_PRODUCTS, HOT_BUNDLE } from '../constants';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  importMockProducts,
} from '../services/productService';
import { signOutAdmin, AdminUser } from '../services/authService';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Loader2,
  LogOut,
  ArrowLeft,
  Package,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Database,
} from 'lucide-react';

interface ProductManagerProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onBack: () => void;
}

interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  compatibleModels: string[];
  image: string;
  description: string;
  isBundle: boolean;
}

const CATEGORIES = [
  'Case',
  'Screen Protector',
  'Charger',
  'Cable',
  'Power Bank',
  'Strap',
  'Audio',
  'Bundle',
];

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  originalPrice: '',
  category: 'Case',
  brand: '',
  compatibleModels: [],
  image: '',
  description: '',
  isBundle: false,
};

const ProductManager: React.FC<ProductManagerProps> = ({ adminUser, onLogout, onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos. Verifica tu conexión a Firebase.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      onLogout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      brand: product.brand || '',
      compatibleModels: product.compatibleModels || [],
      image: product.image,
      description: product.description,
      isBundle: product.isBundle || false,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData(initialFormData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      setError('Error al subir la imagen');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.image || !formData.description.trim()) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        brand: formData.brand || undefined,
        compatibleModels: formData.compatibleModels.length > 0 ? formData.compatibleModels : undefined,
        image: formData.image,
        description: formData.description.trim(),
        isBundle: formData.isBundle,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id as string, productData);
        setSuccessMessage('Producto actualizado correctamente');
      } else {
        await createProduct(productData);
        setSuccessMessage('Producto creado correctamente');
      }

      closeForm();
      loadProducts();
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteProduct(productToDelete.id as string);
      setSuccessMessage('Producto eliminado correctamente');
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMigrateData = async () => {
    if (products.length > 0) {
      if (!window.confirm('Ya existen productos en la base de datos. ¿Deseas agregar los productos de demo igualmente?')) {
        return;
      }
    }

    setIsMigrating(true);
    setError(null);

    try {
      const allMockProducts = [HOT_BUNDLE, ...MOCK_PRODUCTS];
      await importMockProducts(allMockProducts);
      setSuccessMessage(`${allMockProducts.length} productos importados correctamente`);
      loadProducts();
    } catch (err) {
      setError('Error al importar productos');
      console.error(err);
    } finally {
      setIsMigrating(false);
    }
  };

  const toggleCompatibleModel = (model: string) => {
    setFormData(prev => ({
      ...prev,
      compatibleModels: prev.compatibleModels.includes(model)
        ? prev.compatibleModels.filter(m => m !== model)
        : [...prev.compatibleModels, model],
    }));
  };

  const availableModels = formData.brand ? BRAND_MODELS[formData.brand] || [] : [];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-brand-pink text-white p-2 rounded-lg">
                <Package size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-brand-dark">Gestión de Productos</h1>
                <p className="text-xs text-slate-500">{adminUser.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-in slide-in-from-top">
            <Check size={18} />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-brand-pink text-white px-5 py-2.5 rounded-xl font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-brand-pink/20"
          >
            <Plus size={18} />
            <span>Nuevo Producto</span>
          </button>

          <button
            onClick={handleMigrateData}
            disabled={isMigrating}
            className="flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {isMigrating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Database size={18} />
            )}
            <span>{isMigrating ? 'Importando...' : 'Importar Datos Demo'}</span>
          </button>

          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 border transition-colors"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>Actualizar</span>
            )}
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-brand-pink" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-2">No hay productos</p>
              <p className="text-slate-400 text-sm">Crea tu primer producto o importa los datos de demo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-brand-dark">{product.name}</p>
                            <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.brand || 'Universal'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-brand-dark">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-xs text-slate-400 line-through">
                            €{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="p-2 text-slate-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      {isFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeForm}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <h2 className="text-lg font-bold text-brand-dark">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Pink Marble Dream"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none"
                />
              </div>

              {/* Price and Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="15.99"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Precio Original (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={e => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="29.99"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none"
                  />
                </div>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      category: e.target.value,
                      isBundle: e.target.value === 'Bundle',
                    }))}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Marca
                  </label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      brand: e.target.value,
                      compatibleModels: [],
                    }))}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none bg-white"
                  >
                    <option value="">Universal</option>
                    {Object.keys(BRAND_MODELS).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compatible Models */}
              {formData.brand && availableModels.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Modelos Compatibles
                  </label>
                  <div className="border rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                    {availableModels.map(model => (
                      <label
                        key={model}
                        className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.compatibleModels.includes(model)}
                          onChange={() => toggleCompatibleModel(model)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                        />
                        <span className="text-sm text-slate-700">{model}</span>
                      </label>
                    ))}
                  </div>
                  {formData.compatibleModels.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      {formData.compatibleModels.length} modelo(s) seleccionado(s)
                    </p>
                  )}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Imagen del Producto *
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://... o sube una imagen"
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none"
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Upload size={18} />
                    )}
                  </button>
                </div>
                {formData.image && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada del producto..."
                  rows={3}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-pink focus:border-brand-pink outline-none resize-none"
                />
              </div>

              {/* Is Bundle Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBundle}
                  onChange={e => setFormData(prev => ({ ...prev, isBundle: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-sm text-slate-700">Marcar como Bundle/Pack</span>
              </label>
            </form>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-pink text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && productToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsDeleteDialogOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-50 rounded-2xl shadow-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">Eliminar Producto</h3>
              <p className="text-slate-500 mb-6">
                ¿Estás seguro de que deseas eliminar <strong>{productToDelete.name}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
