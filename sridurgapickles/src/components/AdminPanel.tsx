import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { X, Plus, Trash2, Edit3, LogOut, Save, Package, Truck, RefreshCw, Minus, PlusCircle } from 'lucide-react';

interface AdminPanelProps { open: boolean; onClose: () => void; onProductsChanged?: () => void; }
interface EditForm { name: string; category: ProductCategory; description: string; price: string; weight: string; image_url: string; is_vegetarian: boolean; is_available: boolean; }
interface DeliveryZone { id: string; name: string; pincode_prefix: string; charge: number; is_active: boolean; }
const emptyForm: EditForm = { name: '', category: 'Veg Pickles', description: '', price: '', weight: '250 g', image_url: '', is_vegetarian: true, is_available: true };

export function AdminPanel({ open, onClose, onProductsChanged }: AdminPanelProps) {
  const [tab, setTab] = useState<'products' | 'delivery'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [zoneForm, setZoneForm] = useState({ name: '', pincode_prefix: '', charge: '' });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const productsResult = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (productsResult.error) {
        setProducts([]);
        setError(`Could not load products: ${productsResult.error.message}`);
      } else {
        setProducts((productsResult.data as Product[]) || []);
      }

      const zonesResult = await supabase
        .from('delivery_zones')
        .select('*')
        .order('created_at', { ascending: true });
      if (zonesResult.error) {
        // Delivery is optional. If the delivery_zones table has not been created yet,
        // keep the product admin usable and show an empty delivery list instead of
        // blocking the entire panel with a schema-cache error.
        setZones([]);
      } else {
        setZones((zonesResult.data as DeliveryZone[]) || []);
      }

      onProductsChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to the store database.');
    } finally {
      setLoading(false);
    }
  }, [onProductsChanged]);

  useEffect(() => { if (open) void loadAll(); }, [open, loadAll]);

  function startEdit(product: Product) {
    setEditing(product);
    setForm({ name: product.name, category: product.category, description: product.description, price: String(product.price), weight: product.weight, image_url: product.image_url, is_vegetarian: product.is_vegetarian, is_available: product.is_available });
    setShowForm(true);
  }
  function startNew() { setEditing(null); setForm(emptyForm); setShowForm(true); }

  async function uploadImage(file: File) {
    setUploading(true); setError('');
    try {
      if (!file) return;
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif|heic|heif)$/i.test(file.name);
      if (!isImage) { setError('Please select an image file.'); return; }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false, contentType: file.type || 'application/octet-stream' });

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        if (data.publicUrl) {
          setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
          return;
        }
      }

      // Storage may not be configured yet. Keep the selected image usable so the
      // admin can still save the product instead of receiving a false empty-image error.
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Could not read image'));
        reader.readAsDataURL(file);
      });
      setForm((prev) => ({ ...prev, image_url: dataUrl }));
    } catch (err) {
      setError(err instanceof Error ? `Could not use this image: ${err.message}` : 'Could not use this image.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true); setError('');
    const priceNum = parseFloat(form.price);
    if (!form.name.trim() || Number.isNaN(priceNum) || priceNum < 0) { setError('Please enter a valid name and price.'); setSaving(false); return; }
    if (!form.image_url.trim()) { setError('Please select a product image first.'); setSaving(false); return; }
    const payload = { name: form.name.trim(), category: form.category, description: form.description.trim(), price: priceNum, weight: form.weight.trim() || '250 g', image_url: form.image_url.trim(), is_vegetarian: form.is_vegetarian, is_available: form.is_available };
    let saveError: unknown = null;
    if (editing) saveError = (await supabase.from('products').update(payload).eq('id', editing.id)).error;
    else saveError = (await supabase.from('products').insert(payload)).error;
    if (saveError) setError('Could not save product. Please try again.');
    else { setShowForm(false); setEditing(null); setForm(emptyForm); await loadAll(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
    if (deleteError) setError('Could not delete product.'); else await loadAll();
  }

  async function changePrice(product: Product, amount: number) {
    setError('');
    const nextPrice = Math.max(0, Number(product.price) + amount);
    const { error: priceError } = await supabase
      .from('products')
      .update({ price: nextPrice })
      .eq('id', product.id);
    if (priceError) {
      setError(`Could not update ${product.name} price: ${priceError.message}`);
      return;
    }
    await loadAll();
  }

  async function addZone() {
    setError('');
    const charge = Number(zoneForm.charge);
    const prefix = zoneForm.pincode_prefix.trim().replace(/\D/g, '');
    if (!zoneForm.name.trim() || !prefix || Number.isNaN(charge) || charge < 0) { setError('Enter a zone name, pincode prefix and valid charge.'); return; }
    const { error: zoneError } = await supabase.from('delivery_zones').insert({ name: zoneForm.name.trim(), pincode_prefix: prefix, charge, is_active: true });
    if (zoneError) setError('Could not add delivery zone.'); else { setZoneForm({ name: '', pincode_prefix: '', charge: '' }); await loadAll(); }
  }

  async function toggleZone(zone: DeliveryZone) {
    const { error: zoneError } = await supabase.from('delivery_zones').update({ is_active: !zone.is_active }).eq('id', zone.id);
    if (zoneError) setError('Could not update delivery zone.'); else await loadAll();
  }
  async function deleteZone(id: string) {
    if (!confirm('Delete this delivery zone?')) return;
    const { error: zoneError } = await supabase.from('delivery_zones').delete().eq('id', id);
    if (zoneError) setError('Could not delete delivery zone.'); else await loadAll();
  }
  async function handleSignOut() { await supabase.auth.signOut(); onClose(); }
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-stone-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 bg-gradient-to-r from-amber-950 to-red-950 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-amber-100"><Package className="h-5 w-5" /> Admin Panel</h2>
          <div className="flex items-center gap-3"><button onClick={handleSignOut} className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-sm text-amber-200"><LogOut className="h-4 w-4" /> Sign Out</button><button onClick={onClose} className="text-amber-100"><X className="h-6 w-6" /></button></div>
        </div>
        <div className="flex border-b border-stone-200 bg-white">
          <button onClick={() => { setTab('products'); setShowForm(false); }} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold ${tab === 'products' ? 'border-b-2 border-amber-600 text-amber-800' : 'text-stone-500'}`}><Package className="h-4 w-4" /> Products</button>
          <button onClick={() => { setTab('delivery'); setShowForm(false); }} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold ${tab === 'delivery' ? 'border-b-2 border-amber-600 text-amber-800' : 'text-stone-500'}`}><Truck className="h-4 w-4" /> Delivery</button>
        </div>
        {error && <div className="bg-amber-50 px-5 py-2 text-sm text-amber-800">{error}</div>}

        {tab === 'products' && (showForm ? (
          <div className="flex-1 overflow-y-auto p-5">
            <h3 className="mb-4 font-semibold text-stone-700">{editing ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Product name" />
              <div className="grid grid-cols-2 gap-4"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })} className="rounded-lg border border-stone-300 px-3 py-2">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Price (₹)" /></div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-stone-300 px-3 py-2" rows={3} placeholder="Description" />
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Weight / size, e.g. 250 g" />
              <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4"><label className="mb-2 block text-sm font-semibold text-stone-600">Product image</label><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} className="w-full text-sm" />{uploading && <p className="mt-2 text-xs text-stone-500">Uploading image...</p>}{form.image_url && <img src={form.image_url} alt="Preview" className="mt-3 h-28 w-28 rounded-lg object-cover" />}<p className="mt-2 text-xs text-stone-400">Select JPG, JPEG, PNG, WEBP or another image format. The image is saved with the product.</p></div>
              <div className="flex items-center gap-6"><label className="flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={form.is_vegetarian} onChange={(e) => setForm({ ...form, is_vegetarian: e.target.checked })} /> Vegetarian</label><label className="flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Available</label></div>
              <div className="flex gap-3"><button onClick={handleSave} disabled={saving || uploading} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Product'}</button><button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-stone-300 px-6 py-2.5 text-stone-600">Cancel</button></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5"><button onClick={startNew} className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white"><Plus className="h-5 w-5" /> Add New Product</button>{loading ? <div className="py-10 text-center text-stone-400"><p>Loading products...</p><button onClick={loadAll} className="mt-3 inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-600"><RefreshCw className="h-4 w-4" /> Retry</button></div> : products.length === 0 ? <div className="rounded-xl bg-white p-6 text-center shadow-sm"><p className="font-medium text-stone-700">No products loaded.</p><p className="mt-1 text-sm text-stone-400">If this is unexpected, use Retry or check that the Supabase database migration has been applied.</p><button onClick={loadAll} className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Retry</button></div> : <div className="space-y-3">{products.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><img src={product.image_url} alt={product.name} className="h-14 w-14 rounded-lg object-cover" /><div className="flex-1"><div className="flex items-center gap-2"><h4 className="font-medium text-stone-800">{product.name}</h4>{!product.is_available && <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] text-stone-500">Hidden</span>}</div><p className="text-xs text-stone-400">{product.category} • {product.weight}</p><p className="text-sm font-bold text-amber-900">{formatINR(product.price)}</p></div><div className="flex items-center gap-1"><button onClick={() => changePrice(product, -10)} className="rounded-lg bg-stone-100 p-2 text-stone-700 hover:bg-stone-200" title="Decrease price by ₹10"><Minus className="h-4 w-4" /></button><button onClick={() => changePrice(product, 10)} className="rounded-lg bg-green-50 p-2 text-green-700 hover:bg-green-100" title="Increase price by ₹10"><PlusCircle className="h-4 w-4" /></button></div><button onClick={() => startEdit(product)} className="rounded-lg bg-amber-100 p-2 text-amber-700" title="Edit product"><Edit3 className="h-4 w-4" /></button><button onClick={() => handleDelete(product.id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100" title="Delete product"><Trash2 className="h-4 w-4" /> Delete</button></div>)}</div>}</div>
        ))}

        {tab === 'delivery' && <div className="flex-1 overflow-y-auto p-5"><div className="rounded-xl bg-amber-50 p-4"><h3 className="font-semibold text-stone-800">Delivery charges by location</h3><p className="mt-1 text-xs text-stone-500">Add a pincode prefix. Example: 500 → ₹60 applies to 500xxx.</p><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"><input value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Zone name" /><input value={zoneForm.pincode_prefix} onChange={(e) => setZoneForm({ ...zoneForm, pincode_prefix: e.target.value.replace(/\D/g, '') })} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Pincode prefix" /><input type="number" min="0" value={zoneForm.charge} onChange={(e) => setZoneForm({ ...zoneForm, charge: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Charge ₹" /></div><button onClick={addZone} className="mt-3 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white"><Plus className="mr-1 inline h-4 w-4" /> Add Zone</button></div><div className="mt-5 space-y-2">{zones.map((zone) => <div key={zone.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><div className="flex-1"><p className="font-medium text-stone-800">{zone.name}</p><p className="text-xs text-stone-400">{zone.pincode_prefix}xxx • {formatINR(zone.charge)}</p></div><button onClick={() => toggleZone(zone)} className={`rounded-full px-3 py-1 text-xs font-semibold ${zone.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{zone.is_active ? 'Active' : 'Off'}</button><button onClick={() => deleteZone(zone.id)} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 className="h-4 w-4" /></button></div>)}{zones.length === 0 && <p className="py-8 text-center text-stone-400">No delivery zones yet.</p>}</div></div>}
</div>
    </div>
  );
}
