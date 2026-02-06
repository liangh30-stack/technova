import React, { useState } from 'react';
import {
  User, ShoppingBag, MapPin, Heart, ArrowLeft, LogOut,
  Edit3, Trash2, Star, Plus, ShoppingCart, Package,
  CheckCircle, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerAddress, CustomerOrder, Product } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AccountTab = 'profile' | 'orders' | 'addresses' | 'favorites';

interface MyAccountPageProps {
  customer: Customer;
  onLogout: () => void;
  onBack: () => void;
  orders: CustomerOrder[];
  addresses: CustomerAddress[];
  favorites: Set<string | number>;
  products: Product[];
  onUpdateProfile: (data: Partial<Customer>) => Promise<void>;
  onAddAddress: (address: Omit<CustomerAddress, 'id'>) => Promise<void>;
  onUpdateAddress: (id: string, data: Partial<CustomerAddress>) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefaultAddress: (id: string) => Promise<void>;
  onToggleFavorite: (productId: string | number) => void;
  onAddToCart: (product: Product) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORDER_STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-[#FFF8E6] text-brand-warning',
  Paid: 'bg-[#EBF5FA] text-brand-info',
  Shipped: 'bg-brand-primary-light text-brand-primary',
  Completed: 'bg-brand-primary-light text-brand-success',
};

const emptyAddress: Omit<CustomerAddress, 'id'> = {
  label: '',
  fullName: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
  isDefault: false,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MyAccountPage: React.FC<MyAccountPageProps> = ({
  customer,
  onLogout,
  onBack,
  orders,
  addresses,
  favorites,
  products,
  onUpdateProfile,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onToggleFavorite,
  onAddToCart,
}) => {
  const { t } = useTranslation();

  // Tab state
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  // Profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: customer.displayName,
    phone: customer.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Orders state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressSaving, setAddressSaving] = useState(false);

  // -----------------------------------------------------------------------
  // Initials helper
  // -----------------------------------------------------------------------
  const initials = customer.displayName
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // -----------------------------------------------------------------------
  // Sidebar tab config
  // -----------------------------------------------------------------------
  const tabs: { id: AccountTab; label: string; icon: React.FC<{ size?: number }> }[] = [
    { id: 'profile', label: t('customerProfile', 'Profile'), icon: User },
    { id: 'orders', label: t('customerOrders', 'Orders'), icon: ShoppingBag },
    { id: 'addresses', label: t('customerAddresses', 'Addresses'), icon: MapPin },
    { id: 'favorites', label: t('customerFavorites', 'Favorites'), icon: Heart },
  ];

  // -----------------------------------------------------------------------
  // Profile handlers
  // -----------------------------------------------------------------------
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      await onUpdateProfile({
        displayName: profileForm.displayName,
        phone: profileForm.phone || undefined,
      });
      setProfileSuccess(true);
      setEditingProfile(false);
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally {
      setProfileSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Address handlers
  // -----------------------------------------------------------------------
  const openNewAddressForm = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowAddressForm(true);
  };

  const openEditAddressForm = (addr: CustomerAddress) => {
    setAddressForm({
      label: addr.label,
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    setAddressSaving(true);
    try {
      if (editingAddressId) {
        await onUpdateAddress(editingAddressId, addressForm);
      } else {
        await onAddAddress(addressForm);
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm(emptyAddress);
    } finally {
      setAddressSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Sorted orders (newest first)
  // -----------------------------------------------------------------------
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // -----------------------------------------------------------------------
  // Favorited products
  // -----------------------------------------------------------------------
  const favoritedProducts = products.filter((p) => favorites.has(p.id));

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-dark">
        {t('customerProfile', 'Profile')}
      </h2>

      {profileSuccess && (
        <div className="flex items-center gap-2 bg-brand-primary-light text-brand-success px-4 py-3 rounded-lg text-sm font-medium">
          <CheckCircle size={18} />
          {t('customerProfileUpdated', 'Profile updated successfully')}
        </div>
      )}

      <div className="bg-white border border-brand-border rounded-lg p-6">
        {editingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerFullName', 'Full Name')}
              </label>
              <input
                type="text"
                value={profileForm.displayName}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, displayName: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerEmail', 'Email')}
              </label>
              <input
                type="email"
                value={customer.email}
                disabled
                className="w-full border border-brand-border-subtle rounded-lg px-4 py-2.5 text-brand-text-tertiary bg-brand-light cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerPhone', 'Phone')}
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center gap-2 transition-colors"
              >
                {profileSaving && <Loader2 size={16} className="animate-spin" />}
                {t('customerSaveProfile', 'Save Changes')}
              </button>
              <button
                onClick={() => {
                  setEditingProfile(false);
                  setProfileForm({
                    displayName: customer.displayName,
                    phone: customer.phone || '',
                  });
                }}
                className="border border-brand-border text-brand-muted hover:text-brand-dark px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {t('formCancel', 'Cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-brand-text-tertiary uppercase tracking-wider">
                    {t('customerFullName', 'Full Name')}
                  </span>
                  <p className="text-brand-dark font-medium">{customer.displayName}</p>
                </div>
                <div>
                  <span className="text-xs text-brand-text-tertiary uppercase tracking-wider">
                    {t('customerEmail', 'Email')}
                  </span>
                  <p className="text-brand-dark font-medium">{customer.email}</p>
                </div>
                <div>
                  <span className="text-xs text-brand-text-tertiary uppercase tracking-wider">
                    {t('customerPhone', 'Phone')}
                  </span>
                  <p className="text-brand-dark font-medium">
                    {customer.phone || '-'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-brand-primary-light text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Edit3 size={15} />
                {t('customerEditProfile', 'Edit Profile')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-dark">
        {t('customerOrderHistory', 'Order History')}
      </h2>

      {sortedOrders.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-lg py-16 flex flex-col items-center text-center">
          <Package size={48} className="text-brand-border mb-4" />
          <p className="text-brand-muted mb-4">
            {t('customerNoOrders', 'No orders yet. Start shopping!')}
          </p>
          <button
            onClick={onBack}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {t('customerStartShopping', 'Start Shopping')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div
                key={order.id}
                className="bg-white border border-brand-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-brand-light transition-colors text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="hidden sm:flex w-10 h-10 rounded-lg bg-brand-primary-light items-center justify-center flex-shrink-0">
                      <ShoppingBag size={18} className="text-brand-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-brand-dark font-semibold text-sm">
                        {order.id}
                      </div>
                      <div className="text-xs text-brand-text-tertiary">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-brand-dark font-bold text-sm">
                      &euro;{order.total.toFixed(2)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        ORDER_STATUS_STYLES[order.status] || 'bg-brand-light text-brand-muted'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-brand-text-tertiary hidden sm:block">
                      {order.paymentMethod}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-brand-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-brand-muted" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-brand-border-subtle px-4 py-3 bg-brand-light">
                    <h4 className="text-xs text-brand-text-tertiary uppercase tracking-wider mb-3">
                      {t('customerOrderItems', 'Items')}
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <span className="text-brand-dark truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-brand-dark font-medium flex-shrink-0 ml-2">
                            &euro;{item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-dark">
          {t('customerAddresses', 'Addresses')}
        </h2>
        {!showAddressForm && (
          <button
            onClick={openNewAddressForm}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            {t('customerAddAddress', 'Add Address')}
          </button>
        )}
      </div>

      {showAddressForm && (
        <div className="bg-white border border-brand-border rounded-lg p-6 space-y-4">
          <h3 className="text-brand-dark font-semibold">
            {editingAddressId
              ? t('customerEditAddress', 'Edit Address')
              : t('customerAddAddress', 'Add Address')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerAddressLabel', 'Label (e.g. Home, Work)')}
              </label>
              <input
                type="text"
                value={addressForm.label}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, label: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerFullName', 'Full Name')}
              </label>
              <input
                type="text"
                value={addressForm.fullName}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, fullName: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerStreet', 'Street Address')}
              </label>
              <input
                type="text"
                value={addressForm.street}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, street: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerCity', 'City')}
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, city: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerPostalCode', 'Postal Code')}
              </label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, postalCode: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerCountry', 'Country')}
              </label>
              <input
                type="text"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, country: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1">
                {t('customerPhone', 'Phone')}
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-dark focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))
              }
              className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm text-brand-muted">
              {t('customerSetDefault', 'Set as default')}
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSaveAddress}
              disabled={addressSaving}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center gap-2 transition-colors"
            >
              {addressSaving && <Loader2 size={16} className="animate-spin" />}
              {editingAddressId
                ? t('customerSaveProfile', 'Save Changes')
                : t('customerAddAddress', 'Add Address')}
            </button>
            <button
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddressId(null);
                setAddressForm(emptyAddress);
              }}
              className="border border-brand-border text-brand-muted hover:text-brand-dark px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {t('formCancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showAddressForm ? (
        <div className="bg-white border border-brand-border rounded-lg py-16 flex flex-col items-center text-center">
          <MapPin size={48} className="text-brand-border mb-4" />
          <p className="text-brand-muted">
            {t('customerNoAddresses', 'No saved addresses')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-brand-border rounded-lg p-5 hover:border-brand-muted transition-colors relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-brand-dark font-semibold text-sm">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="bg-brand-primary-light text-brand-primary text-xs font-medium px-2 py-0.5 rounded-full">
                      {t('customerDefaultAddress', 'Default')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditAddressForm(addr)}
                    className="p-1.5 text-brand-muted hover:text-brand-primary rounded-lg hover:bg-brand-primary-light transition-colors"
                    aria-label={t('customerEditAddress', 'Edit Address')}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => onDeleteAddress(addr.id)}
                    className="p-1.5 text-brand-muted hover:text-brand-critical rounded-lg hover:bg-[#FFF4F4] transition-colors"
                    aria-label={t('customerDeleteAddress', 'Delete Address')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-dark">{addr.fullName}</p>
              <p className="text-sm text-brand-muted">{addr.street}</p>
              <p className="text-sm text-brand-muted">
                {addr.city}, {addr.postalCode}
              </p>
              <p className="text-sm text-brand-muted">{addr.country}</p>
              {addr.phone && (
                <p className="text-sm text-brand-text-tertiary mt-1">
                  {addr.phone}
                </p>
              )}
              {!addr.isDefault && (
                <button
                  onClick={() => onSetDefaultAddress(addr.id)}
                  className="mt-3 text-xs text-brand-primary hover:text-brand-primary-dark font-medium flex items-center gap-1 transition-colors"
                >
                  <Star size={13} />
                  {t('customerSetDefault', 'Set as default')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-dark">
        {t('customerFavorites', 'Favorites')}
      </h2>

      {favoritedProducts.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-lg py-16 flex flex-col items-center text-center">
          <Heart size={48} className="text-brand-border mb-4" />
          <p className="text-brand-muted mb-4">
            {t('customerNoFavorites', 'No favorites yet. Browse the shop!')}
          </p>
          <button
            onClick={onBack}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {t('customerBackToShop', 'Back to Shop')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-brand-border rounded-lg overflow-hidden hover:border-brand-muted transition-colors group"
            >
              <div className="relative aspect-square bg-brand-light">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                  aria-label={t('customerRemoveFavorite', 'Remove from favorites')}
                >
                  <Heart
                    size={18}
                    className="text-brand-critical fill-brand-critical"
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-brand-dark font-semibold text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-brand-primary font-bold">
                  &euro;{product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => onAddToCart(product)}
                  className="mt-3 w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={16} />
                  {t('addToCart', 'Add to Cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // Panel map
  // -----------------------------------------------------------------------
  const panels: Record<AccountTab, () => React.JSX.Element> = {
    profile: renderProfile,
    orders: renderOrders,
    addresses: renderAddresses,
    favorites: renderFavorites,
  };

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* ============================================================== */}
      {/* Sidebar - collapses to top bar on mobile                       */}
      {/* ============================================================== */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-brand-border flex-shrink-0 flex flex-col">
        {/* Avatar / name */}
        <div className="p-4 border-b border-brand-border flex items-center gap-3 md:flex-col md:items-center md:py-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
            {initials}
          </div>
          <div className="md:text-center min-w-0">
            <div className="text-brand-dark font-semibold text-sm truncate">
              {customer.displayName}
            </div>
            <div className="text-brand-text-tertiary text-xs truncate">
              {customer.email}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav
          className="flex md:flex-col overflow-x-auto md:overflow-x-visible flex-1 md:py-3"
          role="tablist"
          aria-label={t('customerMyAccount', 'My Account')}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 transition-all whitespace-nowrap text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-brand-primary-light text-brand-primary md:border-r-2 md:border-brand-primary'
                  : 'text-brand-muted hover:bg-brand-light hover:text-brand-dark'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="hidden md:block p-3 border-t border-brand-border space-y-2">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-brand-light border border-brand-border transition-colors"
          >
            <ArrowLeft size={16} />
            {t('customerBackToShop', 'Back to Shop')}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-critical bg-[#FFF4F4] hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
            {t('customerLogout', 'Log Out')}
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* Main content area                                              */}
      {/* ============================================================== */}
      <main
        className="flex-1 bg-brand-light overflow-y-auto"
        role="tabpanel"
        aria-label={tabs.find((t) => t.id === activeTab)?.label}
      >
        <div className="p-6 max-w-4xl mx-auto">{panels[activeTab]()}</div>

        {/* Mobile bottom actions */}
        <div className="md:hidden p-4 border-t border-brand-border bg-white flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-muted border border-brand-border transition-colors"
          >
            <ArrowLeft size={16} />
            {t('customerBackToShop', 'Back to Shop')}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-critical bg-[#FFF4F4] hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyAccountPage;
