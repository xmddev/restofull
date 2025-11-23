
import React, { useState } from 'react';
import { Plus, Edit2, Sparkles, Trash2, Package, Utensils, Search, Tag, CalendarDays } from 'lucide-react';
import { INITIAL_MENU, INITIAL_INGREDIENTS, INITIAL_PROMOTIONS } from '../constants';
import { Category, MenuItem, Ingredient, Promotion } from '../types';
import { generateMenuDescription } from '../services/geminiService';

const MenuManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MENU' | 'PROMOS'>('MENU');
  const [products, setProducts] = useState<MenuItem[]>(INITIAL_MENU);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [ingredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS); // Read-only here for recipes
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState<Partial<MenuItem>>({
    name: '', description: '', price: 0, category: Category.MAIN
  });
  const [generating, setGenerating] = useState(false);
  const [recipeInput, setRecipeInput] = useState('');

  const handleGenerateDescription = async () => {
    if (!newProduct.name) return;
    setGenerating(true);
    const desc = await generateMenuDescription(newProduct.name, recipeInput || 'ingredientes frescos');
    setNewProduct(prev => ({ ...prev, description: desc }));
    setGenerating(false);
  };

  const renderMenuTab = () => (
    <>
      <div className="flex justify-end mb-4">
            <button 
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
            <Plus size={20} />
            Nuevo Plato
            </button>
       </div>
      
      {Object.values(Category).map(category => {
        const categoryItems = products.filter(i => i.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-slate-600 mb-3 border-b border-slate-200 pb-2 flex justify-between">
                {category}
                <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded-full">{categoryItems.length} platos</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categoryItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">${item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex gap-1 text-xs text-slate-500">
                        <Package size={14} />
                        <span>Receta: {item.recipe?.length || 0} insumos</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-indigo-600"><Edit2 size={18} /></button>
                        <button className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );

  const renderPromosTab = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div>
                  <h3 className="font-bold text-indigo-800">Marketing y Fidelización</h3>
                  <p className="text-sm text-indigo-600">Crea reglas automáticas como "2x1" o descuentos por Happy Hour.</p>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700">
                  <Plus size={18}/> Nueva Promoción
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map(promo => (
                  <div key={promo.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase ${promo.isActive ? 'bg-emerald-100 text-emerald-700 rounded-bl-lg' : 'bg-slate-100 text-slate-500 rounded-bl-lg'}`}>
                          {promo.isActive ? 'Activa' : 'Inactiva'}
                      </div>
                      <div className="flex items-start gap-3 mb-3">
                          <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Tag size={24}/></div>
                          <div>
                              <h4 className="font-bold text-slate-800">{promo.name}</h4>
                              <p className="text-xs text-slate-500">{promo.type === '2x1' ? 'Paga 1, Lleva 2' : `${promo.value}% Descuento`}</p>
                          </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{promo.description}</p>
                      
                      <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-2">
                              <CalendarDays size={14}/>
                              <span className="capitalize">Días: {promo.activeDays.map(d => ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'][d]).join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Utensils size={14}/>
                              <span>Aplica a: {promo.targetProductIds ? `${promo.targetProductIds.length} Productos` : `Cat. ${promo.targetCategory}`}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ingeniería de Menú</h1>
          <p className="text-slate-500 text-sm">Administra tus platos, precios y configura promociones.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-200">
        <button 
            onClick={() => setActiveTab('MENU')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'MENU' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
            <Utensils size={18}/> Carta / Productos
        </button>
        <button 
            onClick={() => setActiveTab('PROMOS')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'PROMOS' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
            <Tag size={18}/> Promociones
        </button>
      </div>
      
      {activeTab === 'MENU' ? renderMenuTab() : renderPromosTab()}

      {/* Simple Modal Logic for Demo */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Crear Producto</h2>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Nombre del plato"
                    className="w-full border p-2 rounded-lg"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <div className="flex gap-4">
                    <input 
                        type="number" 
                        placeholder="Precio"
                        className="w-full border p-2 rounded-lg"
                        value={newProduct.price || ''}
                        onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                    <select className="border p-2 rounded-lg w-full">
                        {Object.values(Category).map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                    <textarea 
                        className="w-full border p-2 rounded-lg mt-1" 
                        rows={3} 
                        placeholder="Descripción del plato..."
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                    <button 
                        onClick={handleGenerateDescription}
                        disabled={generating}
                        className="text-indigo-600 text-sm font-medium flex items-center gap-1 mt-2"
                    >
                        <Sparkles size={14} /> Generar descripción con Gemini
                    </button>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Package size={16}/> Receta Estándar</h3>
                    <p className="text-xs text-slate-400 mb-2">Selecciona los insumos que componen este plato para el descuento automático de inventario.</p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-[100px] flex items-center justify-center text-slate-400 text-sm italic">
                        Funcionalidad de selección de receta (Demo)
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-slate-100 py-2 rounded-lg text-slate-600 font-medium">Cancelar</button>
                    <button onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-indigo-200">Guardar Plato</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
