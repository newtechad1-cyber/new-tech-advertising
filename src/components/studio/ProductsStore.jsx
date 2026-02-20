import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ShoppingBag } from 'lucide-react';

const TYPES = ['ebook', 'template', 'course', 'service', 'other'];

export default function ProductsStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', product_type: 'ebook', image_url: '', file_url: '', status: 'active' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Product.list('-created_date');
    setProducts(data);
    setLoading(false);
  };

  const save = async () => {
    const payload = { ...form, price: parseFloat(form.price) || 0 };
    if (editing) await base44.entities.Product.update(editing.id, payload);
    else await base44.entities.Product.create(payload);
    reset(); load();
  };

  const remove = async (id) => { await base44.entities.Product.delete(id); load(); };

  const startEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description || '', price: p.price, product_type: p.product_type, image_url: p.image_url || '', file_url: p.file_url || '', status: p.status }); setShowForm(true); };

  const reset = () => { setEditing(null); setForm({ name: '', description: '', price: '', product_type: 'ebook', image_url: '', file_url: '', status: 'active' }); setShowForm(false); };

  const uploadFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, [field]: file_url }));
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Products Store</h2>
        <Button onClick={() => { reset(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Product Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Product name" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Price ($)</label>
              <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="29.99" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Description</label>
            <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short description..." className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Type</label>
              <select value={form.product_type} onChange={e => setForm({...form, product_type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Product Image</label>
              <input type="file" accept="image/*" onChange={e => uploadFile(e, 'image_url')} className="text-slate-400 text-sm" />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-16 rounded" />}
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Download File</label>
              <input type="file" onChange={e => uploadFile(e, 'file_url')} className="text-slate-400 text-sm" />
              {form.file_url && <p className="text-green-400 text-xs mt-1">File uploaded ✓</p>}
            </div>
          </div>
          {uploading && <p className="text-yellow-400 text-sm">Uploading...</p>}
          <div className="flex gap-3">
            <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700">{editing ? 'Update' : 'Add'} Product</Button>
            <Button variant="ghost" onClick={reset} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400">Loading...</p> : (
        products.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No products yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover" />}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <span className="text-emerald-400 font-bold">${p.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className="bg-slate-700 text-slate-300 text-xs">{p.product_type}</Badge>
                      <Badge className={p.status === 'active' ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-700 text-slate-400'} variant="outline">{p.status}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(p)} className="text-slate-400 h-7 w-7"><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="text-red-500 h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}