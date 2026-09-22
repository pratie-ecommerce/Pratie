'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Papa from 'papaparse';
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { Product } from '../../types/index';
import { formatPaise, MOCK_PRODUCTS, API_BASE } from '../../lib/api';
import { toast } from 'sonner';

const STATES = [
  'Bihar',
  'Uttar Pradesh',
  'Rajasthan',
  'Madhya Pradesh',
  'Jammu & Kashmir',
  'Gujarat',
  'Tamil Nadu',
  'Punjab',
  'West Bengal',
  'Odisha'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [skuPrefix, setSkuPrefix] = useState('');
  const [state, setState] = useState('Bihar');
  const [clothingType, setClothingType] = useState('Saree');
  const [craftTechnique, setCraftTechnique] = useState('Mithila / Madhubani Handpainted');
  const [fabric, setFabric] = useState('100% Handspun Bhagalpuri Tussar Silk');
  const [categoryName, setCategoryName] = useState('Mithila Couture');
  const [brandName, setBrandName] = useState('Pratiè Atelier');
  const [priceRupees, setPriceRupees] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('20');

  useEffect(() => {
    fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer mock_admin_token` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const basePricePaise = Math.round(parseFloat(priceRupees) * 100);

    const newProd: Product = {
      id: `p_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      skuPrefix: skuPrefix || 'PRT-NEW',
      shortDescription: description.slice(0, 80),
      description,
      state,
      clothingType,
      craftTechnique,
      fabric,
      categoryName,
      brandName,
      basePricePaise,
      isFeatured: true,
      isPublished: true,
      isNewArrival: true,
      ratingAverage: 5.0,
      ratingCount: 0,
      tags: [state.toLowerCase(), clothingType.toLowerCase(), 'curated'],
      media: [
        {
          imageUrl:
            imageUrl ||
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      variants: [
        {
          id: `v_${Date.now()}`,
          productId: `p_${Date.now()}`,
          sku: `${skuPrefix || 'PRT'}-01`,
          size: 'Standard',
          additionalPricePaise: 0,
          stockQuantity: parseInt(stockQuantity, 10) || 10,
          isAvailable: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    toast.success(`Created product: ${title} (${state})`);

    // Reset Form
    setTitle('');
    setPriceRupees('');
    setDescription('');
    setImageUrl('');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted from catalog');
  };

  // CSV Bulk Import via PapaParse
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const imported: Product[] = results.data.map((row: any, idx: number) => ({
          id: `p_csv_${Date.now()}_${idx}`,
          title: row.title || 'Untitled Creation',
          slug: (row.title || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          skuPrefix: row.sku_prefix || 'PRT-CSV',
          shortDescription: row.short_description || row.title,
          description: row.description || row.title,
          state: row.state || 'Bihar',
          clothingType: row.clothing_type || 'Saree',
          craftTechnique: row.craft_technique || 'Handloom',
          fabric: row.fabric || 'Pure Silk',
          categoryName: row.category || 'Mithila Couture',
          brandName: row.brand || 'Pratiè Atelier',
          basePricePaise: parseInt(row.base_price_paise, 10) || 2500000,
          isFeatured: true,
          isPublished: true,
          isNewArrival: true,
          ratingAverage: 5.0,
          ratingCount: 0,
          tags: (row.tags || 'luxury').split(',').map((t: string) => t.trim()),
          media: [
            {
              imageUrl:
                row.image_url ||
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
            }
          ],
          variants: [
            {
              id: `v_csv_${idx}`,
              productId: `p_csv_${idx}`,
              sku: `${row.sku_prefix || 'PRT'}-REG`,
              size: row.size || 'Regular',
              additionalPricePaise: 0,
              stockQuantity: parseInt(row.stock || '20', 10),
              isAvailable: true
            }
          ],
          createdAt: new Date().toISOString()
        }));

        setProducts([...imported, ...products]);
        toast.success(`Bulk imported ${imported.length} traditional products from CSV`);
      },
      error: () => {
        toast.error('Failed to parse CSV dataset');
      }
    });
  };

  // CSV Export via PapaParse
  const handleExportCsv = () => {
    const csvData = products.map((p) => ({
      id: p.id,
      title: p.title,
      sku_prefix: p.skuPrefix,
      state: p.state || 'All India',
      clothing_type: p.clothingType || 'Saree',
      craft_technique: p.craftTechnique || 'Handloom',
      fabric: p.fabric || 'Pure Silk',
      category: p.categoryName,
      brand: p.brandName,
      base_price_paise: p.basePricePaise,
      price_inr: (p.basePricePaise / 100).toFixed(2),
      stock: p.variants.reduce((acc, v) => acc + v.stockQuantity, 0),
      image_url: p.media[0]?.imageUrl || ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pratie_state_traditional_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Catalog exported as CSV');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.skuPrefix.toLowerCase().includes(search.toLowerCase()) ||
      (p.state && p.state.toLowerCase().includes(search.toLowerCase())) ||
      (p.craftTechnique && p.craftTechnique.toLowerCase().includes(search.toLowerCase()));

    const matchesState = !selectedStateFilter || p.state === selectedStateFilter;
    const matchesType = !selectedTypeFilter || p.clothingType === selectedTypeFilter;

    return matchesSearch && matchesState && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold flex items-center gap-1.5">
            <MapPin size={12} /> State-Wise Inventory Hub
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Traditional Attire & Sarees/Suits</h1>
          <p className="text-xs text-gray-400">
            Manage Indian state origins, silk weaves, pricing, and CSV bulk imports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-3 py-2 rounded text-xs font-semibold cursor-pointer transition-colors">
            <Upload size={14} />
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-3 py-2 rounded text-xs font-semibold transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded text-xs font-bold transition-all shadow-md"
          >
            <Plus size={15} />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121418] border border-white/10 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search state, silk, saree, craft..."
            className="w-full bg-white/5 text-xs text-white pl-9 pr-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* State Filter */}
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="bg-white/5 text-xs text-white px-3 py-2 rounded border border-white/10 focus:outline-none"
          >
            <option value="">All Indian States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Silhouette / Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-white/5 text-xs text-white px-3 py-2 rounded border border-white/10 focus:outline-none"
          >
            <option value="">All Silhouettes</option>
            <option value="Saree">Sarees</option>
            <option value="Suit">Suits & Sets</option>
            <option value="Heirloom Accent">Accents</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121418] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-gray-400 font-semibold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">Creation & Loom</th>
                <th className="px-6 py-3.5">State Origin</th>
                <th className="px-6 py-3.5">Garment & Craft</th>
                <th className="px-6 py-3.5">Base Price</th>
                <th className="px-6 py-3.5">Inventory Stock</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                const isLowStock = totalStock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-white/5 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              p.media[0]?.imageUrl ||
                              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'
                            }
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white line-clamp-1">{p.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{p.skuPrefix}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 px-2 py-0.5 rounded text-[11px] font-semibold">
                        📍 {p.state || 'All India'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{p.clothingType || 'Saree'}</div>
                      <div className="text-[10px] text-gray-400">{p.craftTechnique || 'Handloom'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {formatPaise(p.basePricePaise)}
                      <span className="block text-[10px] text-gray-500 font-normal">
                        ({p.basePricePaise} Paise)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          isLowStock
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}
                      >
                        {totalStock} pieces {isLowStock && '• Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative bg-[#121418] text-white border border-white/10 rounded-lg max-w-2xl w-full p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-1">Add New Traditional Attire Piece</h2>
            <p className="text-xs text-gray-400 mb-6">
              Specify Indian state origin, craft technique, fabric, and pricing.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mithila Handpainted Tussar Silk Saree"
                  className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none focus:border-[#c5a059]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    State of Origin *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#1c1e24] border border-white/10 text-xs p-3 rounded text-white focus:outline-none"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Silhouette / Garment *
                  </label>
                  <select
                    value={clothingType}
                    onChange={(e) => setClothingType(e.target.value)}
                    className="w-full bg-[#1c1e24] border border-white/10 text-xs p-3 rounded text-white focus:outline-none"
                  >
                    <option value="Saree">Saree</option>
                    <option value="Suit">Suit / Kurta Set</option>
                    <option value="Heirloom Accent">Heirloom Accent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Craft & Weave Technique
                  </label>
                  <input
                    type="text"
                    value={craftTechnique}
                    onChange={(e) => setCraftTechnique(e.target.value)}
                    placeholder="e.g. Banarasi Kadwa Brocade"
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Fabric & Material
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Pure Katan Silk"
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    SKU Prefix *
                  </label>
                  <input
                    type="text"
                    value={skuPrefix}
                    onChange={(e) => setSkuPrefix(e.target.value)}
                    placeholder="PRT-MTH-SAR-01"
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Base Price in Rupees (₹) *
                  </label>
                  <input
                    type="number"
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(e.target.value)}
                    placeholder="e.g. 28999"
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Description & Provenance Story *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail weaver cluster, natural dyes, and historical heritage..."
                  className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded text-white focus:outline-none focus:border-[#c5a059]"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold px-4 py-2.5 rounded uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold px-6 py-2.5 rounded uppercase tracking-wider"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
