
import React, { useState } from 'react';
import { 
  Package, Search, Plus, AlertTriangle, TrendingDown, 
  TrendingUp, FileText, Truck, DollarSign, History, X 
} from 'lucide-react';
import { INITIAL_INGREDIENTS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS } from '../constants';
import { Ingredient, InventoryTransaction, Supplier, TransactionType } from '../types';

const InventoryManager: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(INITIAL_TRANSACTIONS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  
  // Modals
  const [activeModal, setActiveModal] = useState<'NEW_ITEM' | 'RESTOCK' | 'WASTE' | 'KARDEX' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);

  // Form States
  const [txQuantity, setTxQuantity] = useState<number>(0);
  const [txCost, setTxCost] = useState<number>(0);
  const [txNotes, setTxNotes] = useState('');
  const [newItem, setNewItem] = useState<Partial<Ingredient>>({ unit: 'und', category: 'Producción' });

  // Calculations
  const totalInventoryValue = ingredients.reduce((acc, curr) => acc + (curr.cost * curr.currentStock), 0);
  const lowStockCount = ingredients.filter(i => i.currentStock <= i.minStock).length;
  const categories = ['Todos', ...Array.from(new Set(ingredients.map(i => i.category)))];

  // Helper: Filtered List
  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase()) || ing.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'Todos' || ing.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Handlers
  const handleTransaction = (type: TransactionType) => {
    if (!selectedItem || !txQuantity) return;

    const newTx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      ingredientId: selectedItem.id,
      type,
      quantity: type === TransactionType.WASTE ? -txQuantity : txQuantity, // Waste is negative
      unitCost: type === TransactionType.PURCHASE ? txCost : selectedItem.cost,
      totalValue: (type === TransactionType.PURCHASE ? txCost : selectedItem.cost) * txQuantity,
      date: new Date(),
      performedBy: 'Admin',
      notes: txNotes
    };

    // Update Transaction History
    setTransactions([newTx, ...transactions]);

    // Update Stock
    setIngredients(ingredients.map(ing => {
      if (ing.id === selectedItem.id) {
        let newStock = ing.currentStock;
        let newCost = ing.cost;

        if (type === TransactionType.PURCHASE) {
          newStock += txQuantity;
          // Weighted Average Cost Formula: ((OldStock * OldCost) + (NewQty * NewCost)) / TotalStock
          newCost = ((ing.currentStock * ing.cost) + (txQuantity * txCost)) / newStock;
        } else {
            newStock -= txQuantity; // Waste or Out
        }

        return { ...ing, currentStock: newStock, cost: newCost, lastUpdated: new Date() };
      }
      return ing;
    }));

    closeModal();
  };

  const handleCreateItem = () => {
    if (!newItem.name || !newItem.sku) return;
    const item: Ingredient = {
      id: `ing-${Date.now()}`,
      sku: newItem.sku!,
      name: newItem.name!,
      category: newItem.category || 'Varios',
      unit: newItem.unit as any,
      cost: newItem.cost || 0,
      currentStock: newItem.currentStock || 0,
      minStock: newItem.minStock || 5,
      maxStock: 100,
      supplierId: newItem.supplierId,
      lastUpdated: new Date()
    };
    setIngredients([...ingredients, item]);
    closeModal();
  };

  const openModal = (type: 'NEW_ITEM' | 'RESTOCK' | 'WASTE' | 'KARDEX', item?: Ingredient) => {
    setActiveModal(type);
    setSelectedItem(item || null);
    setTxQuantity(0);
    setTxCost(item?.cost || 0);
    setTxNotes('');
    if (type === 'NEW_ITEM') setNewItem({ unit: 'und', category: 'Producción' });
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header & KPIs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-indigo-600" />
            Inventario & Compras
          </h1>
          <p className="text-slate-500 text-sm">Gestión Enterprise de Stock, Proveedores y Kardex.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 flex-1 md:flex-none">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><DollarSign size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Valor</p>
              <p className="font-mono font-bold text-slate-800 text-sm md:text-base">${totalInventoryValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 flex-1 md:flex-none">
             <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Bajos</p>
              <p className="font-mono font-bold text-slate-800 text-sm md:text-base">{lowStockCount} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por Nombre o SKU..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
            >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <button 
            onClick={() => openModal('NEW_ITEM')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
            <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">SKU</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Producto</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Categoría</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Proveedor</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Costo Unit.</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Stock</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredIngredients.map(item => {
                        const stockStatus = item.currentStock <= item.minStock ? 'low' : 'ok';
                        const supplier = suppliers.find(s => s.id === item.supplierId);
                        
                        return (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-slate-400 capitalize">{item.unit === 'und' ? 'Unidad/Pack' : item.unit}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {supplier?.name || '-'}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                                    ${item.cost.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className={`inline-flex flex-col items-center px-3 py-1 rounded-lg border ${stockStatus === 'low' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <span className={`font-bold text-sm ${stockStatus === 'low' ? 'text-red-700' : 'text-emerald-700'}`}>
                                            {item.currentStock} {item.unit}
                                        </span>
                                        {stockStatus === 'low' && <span className="text-[10px] text-red-500 font-bold uppercase">Reordenar</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => openModal('KARDEX', item)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" 
                                            title="Ver Kardex"
                                        >
                                            <History size={18} />
                                        </button>
                                        <button 
                                            onClick={() => openModal('WASTE', item)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                                            title="Registrar Merma"
                                        >
                                            <TrendingDown size={18} />
                                        </button>
                                        <button 
                                            onClick={() => openModal('RESTOCK', item)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" 
                                            title="Recepcionar Pedido"
                                        >
                                            <Truck size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {/* MODALS */}
      
      {/* 1. RESTOCK MODAL (Purchase) */}
      {activeModal === 'RESTOCK' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><Truck size={20}/> Recepción de Pedido</h3>
                    <button onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Producto</label>
                        <input disabled value={selectedItem.name} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad ({selectedItem.unit})</label>
                            <input type="number" autoFocus value={txQuantity} onChange={e => setTxQuantity(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo Unitario</label>
                            <input type="number" value={txCost} onChange={e => setTxCost(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none font-mono" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas / # Factura</label>
                         <input type="text" value={txNotes} onChange={e => setTxNotes(e.target.value)} placeholder="Ej. Factura F-00231" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                        <span className="text-sm font-bold text-slate-600">Nuevo Costo Promedio:</span>
                        <span className="font-mono font-bold text-emerald-600">
                           ${(( (selectedItem.currentStock * selectedItem.cost) + (txQuantity * txCost) ) / (selectedItem.currentStock + txQuantity) || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    <button onClick={() => handleTransaction(TransactionType.PURCHASE)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-colors">
                        Confirmar Ingreso
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 2. WASTE MODAL */}
      {activeModal === 'WASTE' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><TrendingDown size={20}/> Registrar Merma/Salida</h3>
                    <button onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0"/>
                        <p>Esta acción descontará inventario y registrará una pérdida financiera.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Producto</label>
                        <input disabled value={selectedItem.name} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-bold" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad a descontar ({selectedItem.unit})</label>
                        <input type="number" autoFocus value={txQuantity} onChange={e => setTxQuantity(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none font-mono" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo</label>
                         <select value={txNotes} onChange={e => setTxNotes(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none">
                             <option value="">Seleccionar motivo...</option>
                             <option value="Vencimiento">Vencimiento</option>
                             <option value="Daño en manejo">Daño en manejo / Accidente</option>
                             <option value="Calidad insuficiente">Calidad insuficiente</option>
                             <option value="Degustación / Cortesía">Degustación / Cortesía</option>
                         </select>
                    </div>
                    <button onClick={() => handleTransaction(TransactionType.WASTE)} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-colors">
                        Registrar Pérdida
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 3. NEW ITEM MODAL */}
      {activeModal === 'NEW_ITEM' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><Plus size={20}/> Nuevo Insumo / Producto</h3>
                    <button onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU / Código</label>
                            <input type="text" placeholder="Ej. CAR-001" value={newItem.sku || ''} onChange={e => setNewItem({...newItem, sku: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                            <input type="text" list="categories" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                            <datalist id="categories">{categories.map(c => <option key={c} value={c}/>)}</datalist>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                        <input type="text" placeholder="Ej. Carne Hamburguesa (Pack 150g)" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unidad</label>
                            <select value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value as any})} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                                <option value="und">Unidad / Pack</option>
                                <option value="kg">Kilogramo</option>
                                <option value="lt">Litro</option>
                                <option value="gr">Gramo</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock Min.</label>
                             <input type="number" value={newItem.minStock} onChange={e => setNewItem({...newItem, minStock: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo Unit.</label>
                             <input type="number" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proveedor Principal</label>
                        <select value={newItem.supplierId} onChange={e => setNewItem({...newItem, supplierId: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                            <option value="">Seleccionar...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button onClick={handleCreateItem} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold mt-2">
                        Guardar en Inventario
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 4. KARDEX MODAL */}
      {activeModal === 'KARDEX' && selectedItem && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 h-[600px] flex flex-col">
                <div className="bg-slate-800 p-4 flex justify-between items-center text-white rounded-t-2xl">
                    <div>
                        <h3 className="font-bold flex items-center gap-2"><History size={20}/> Kardex / Historial</h3>
                        <p className="text-xs text-slate-400 font-mono mt-1">{selectedItem.name} (SKU: {selectedItem.sku})</p>
                    </div>
                    <button onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Cant.</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Costo Unit.</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Valor Total</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Usuario / Nota</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions
                                .filter(t => t.ingredientId === selectedItem.id)
                                .sort((a,b) => b.date.getTime() - a.date.getTime())
                                .map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                        {tx.date.toLocaleDateString()} <span className="text-xs opacity-50">{tx.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            tx.type === TransactionType.PURCHASE ? 'bg-emerald-100 text-emerald-700' : 
                                            tx.type === TransactionType.WASTE ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 font-mono text-sm font-bold ${tx.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {tx.quantity > 0 ? '+' : ''}{tx.quantity} {selectedItem.unit}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-slate-600">${tx.unitCost.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-700">${tx.totalValue.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-[150px] truncate">
                                        <span className="font-bold text-slate-700">{tx.performedBy}:</span> {tx.notes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default InventoryManager;
