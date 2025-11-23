
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Send, Minus, Plus, Clock, Lock, X, ChevronDown, ChevronUp, Receipt, AlertTriangle } from 'lucide-react';
import { INITIAL_MENU, INITIAL_TABLES, INITIAL_ORDERS } from '../data/constants';
import { Category, MenuItem, OrderItem, TableStatus } from '../types';

const OrderEntry: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  
  const table = INITIAL_TABLES.find(t => t.id === tableId);
  const isTableOccupied = table?.status === TableStatus.OCCUPIED || table?.status === TableStatus.PAYMENT_PENDING;

  const [viewMode, setViewMode] = useState<'SUMMARY' | 'MENU'>(() => isTableOccupied ? 'SUMMARY' : 'MENU');

  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.STARTER);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [existingItems, setExistingItems] = useState<OrderItem[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isTableOccupied) {
        const existingOrder = INITIAL_ORDERS.find(o => o.tableId === tableId);
        if (existingOrder) {
            setExistingItems(existingOrder.items);
        }
    }
  }, [tableId, isTableOccupied]);

  const addToCart = (product: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItemId === product.id);
      if (existing) {
        return prev.map(item => 
          item.menuItemId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { menuItemId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.menuItemId === menuItemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const filteredProducts = INITIAL_MENU.filter(item => 
    item.category === selectedCategory && 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const existingTotal = existingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = cartTotal + existingTotal;

  const handleSendToKitchen = () => {
    const isUpdate = isTableOccupied;
    alert(isUpdate ? "¡Comanda actualizada con nuevos productos!" : "¡Comanda enviada a cocina!");
    navigate('/tables');
  };

  if (viewMode === 'SUMMARY') {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Mesa {table?.label || tableId}
                            <span className="text-xs bg-red-500 px-2 py-1 rounded-full uppercase">Ocupada</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Detalle de consumo actual</p>
                    </div>
                    <button onClick={() => navigate('/tables')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Receipt size={16}/> Items en Comanda
                        </h2>
                        
                        {existingItems.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 italic border-2 border-dashed border-slate-100 rounded-xl">
                                Sin productos registrados (Error de datos o mesa recién abierta)
                            </div>
                        ) : (
                            <div className="space-y-1 divide-y divide-slate-100">
                                {existingItems.map((item, idx) => (
                                    <div key={idx} className="py-4 flex justify-between items-start group hover:bg-slate-50 rounded-lg px-2 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <span className="bg-slate-100 text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shrink-0">
                                                {item.quantity}x
                                            </span>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg leading-none">{item.name}</p>
                                                {item.notes && (
                                                    <p className="text-amber-600 text-xs mt-1 italic bg-amber-50 inline-block px-2 py-0.5 rounded">
                                                        Nota: {item.notes}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                     <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock size={12} /> Enviado 12:30 PM
                                                     </span>
                                                     <span className="text-xs bg-emerald-100 text-emerald-700 px-2 rounded-full font-bold">
                                                        En Cocina
                                                     </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-bold text-slate-600">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 border-slate-100 pt-6 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Total Consumo</span>
                            <span className="text-3xl font-bold text-slate-900">${existingTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button 
                            onClick={() => setViewMode('MENU')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            <Plus size={24} />
                            Añadir Productos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const renderCartContent = () => (
    <div className="flex flex-col h-full">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Resumen Pedido</h2>
            <p className="text-sm text-slate-500">{existingItems.length + cart.length} items en total</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {existingItems.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Lock size={12} />
                        <span>Previamente Pedido (Cocina)</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100">
                        {existingItems.map((item, idx) => (
                            <div key={`ex-${idx}`} className="p-3 flex items-center justify-between opacity-70">
                                <div className="flex gap-3">
                                    <span className="bg-slate-200 text-slate-600 w-6 h-6 flex items-center justify-center rounded text-xs font-bold">
                                        {item.quantity}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                                        <p className="text-xs text-slate-400">${(item.price * item.quantity).toLocaleString()}</p>
                                        {item.notes && <p className="text-[10px] text-amber-600 italic">{item.notes}</p>}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400">
                                    <Clock size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <span>🛒 Nuevo Pedido</span>
                </div>
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium">Selecciona productos</p>
                    </div>
                ) : (
                    cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-right-5 duration-200 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                <p className="text-xs text-slate-500">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center bg-slate-100 rounded-lg">
                                <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-2 hover:text-red-600 transition-colors"><Minus size={14} /></button>
                                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-2 hover:text-emerald-600 transition-colors"><Plus size={14} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 pb-safe-area">
            <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal (Anterior)</span>
                    <span>${existingTotal.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal (Nuevo)</span>
                    <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Mesa</span>
                    <span>${grandTotal.toLocaleString()}</span>
                </div>
            </div>
           
            <button 
                onClick={handleSendToKitchen}
                disabled={cart.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
                <Send size={20} />
                {existingItems.length > 0 ? 'Agregar a Comanda' : 'Enviar a Cocina'}
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <div className="bg-white p-4 shadow-sm z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => isTableOccupied ? setViewMode('SUMMARY') : navigate('/tables')} 
                className="p-2 hover:bg-slate-100 rounded-full"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-slate-800 whitespace-nowrap">Mesa {table?.label || tableId}</h1>
                    {isTableOccupied && (
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <Plus size={10}/> Modo Añadir
                        </span>
                    )}
                </div>
            </div>
          </div>
          
          <div className="flex-1 w-full md:max-w-md md:ml-auto relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar plato..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border-b border-slate-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start pb-24">
          {filteredProducts.map(product => {
            const isSoldOut = product.name.includes("Brioche") || product.name.includes("Rúcula"); 

            return (
            <button 
              key={product.id}
              onClick={() => !isSoldOut && addToCart(product)}
              disabled={isSoldOut}
              className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col text-left transition-all active:scale-95 h-full ${
                  isSoldOut ? 'opacity-60 cursor-not-allowed border-slate-100' : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-300 relative overflow-hidden shrink-0">
                  <span className="text-4xl">🍽️</span>
                  {isSoldOut && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold transform -rotate-12 border-2 border-white px-2 py-1 rounded">AGOTADO</span>
                      </div>
                  )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-slate-800 leading-tight mb-1">{product.name}</h3>
                  <p className="text-indigo-600 font-bold mt-auto">${product.price.toLocaleString()}</p>
              </div>
            </button>
          )})}
        </div>
      </div>

      <div className="hidden lg:flex w-96 bg-white border-l border-slate-200 flex-col shadow-xl z-20">
          {renderCartContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-indigo-900 text-white py-3 rounded-xl font-bold shadow-lg flex justify-between items-center px-6"
          >
            <div className="flex items-center gap-2">
                <span className="bg-white text-indigo-900 w-6 h-6 rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                </span>
                <span>Ver Pedido</span>
            </div>
            <span>${grandTotal.toLocaleString()}</span>
            <ChevronUp size={20} />
          </button>
      </div>

      {isCartOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
              <div className="bg-white rounded-t-2xl shadow-2xl h-[85vh] w-full relative animate-in slide-in-from-bottom-10 duration-300 flex flex-col">
                  <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1"></div>
                  {renderCartContent()}
              </div>
          </div>
      )}
    </div>
  );
};

export default OrderEntry;
