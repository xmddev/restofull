
import React, { useState } from 'react';
import { Search, CreditCard, Banknote, Printer, QrCode, LayoutGrid, ChevronRight, ChevronDown, Receipt, Tag, Percent, CheckCircle2 } from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_TABLES, INITIAL_PROMOTIONS } from '../constants';
import { OrderStatus, TableStatus, Promotion } from '../types';

const POS: React.FC = () => {
  // Filter tables that have something to pay (Occupied or Payment Pending)
  const activeTables = INITIAL_TABLES.filter(t => 
    t.status === TableStatus.OCCUPIED || t.status === TableStatus.PAYMENT_PENDING
  );

  const [selectedTableId, setSelectedTableId] = useState<string>(activeTables[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  
  // Local State for Discount (Simulation)
  // In a real app, this would dispatch an update to the backend order
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [activePromo, setActivePromo] = useState<Promotion | null>(null);

  // Find the order for the selected table
  const order = INITIAL_ORDERS.find(o => o.tableId === selectedTableId);

  // Calculations
  const subtotal = order ? order.subtotal : 0;
  const discountAmount = appliedDiscount;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const impoconsumo = subtotalAfterDiscount * 0.08;
  const total = subtotalAfterDiscount + impoconsumo + (order?.tip || 0);

  const handleApplyPromo = (promo: Promotion) => {
    if (!order) return;
    
    let calculatedDiscount = 0;

    if (promo.type === '2x1') {
        // Logic for 2x1: Find items that match targetProductIds
        // If quantity >= 2, discount = price * floor(qty/2)
        order.items.forEach(item => {
            if (promo.targetProductIds?.includes(item.menuItemId)) {
                const freeItems = Math.floor(item.quantity / 2);
                calculatedDiscount += freeItems * item.price;
            }
        });
    } else if (promo.type === 'PERCENTAGE') {
        // Logic for Percentage
        calculatedDiscount = subtotal * (promo.value / 100);
    }

    if (calculatedDiscount > 0) {
        setAppliedDiscount(calculatedDiscount);
        setActivePromo(promo);
        alert(`¡Promoción "${promo.name}" aplicada! Ahorro: $${calculatedDiscount.toLocaleString()}`);
    } else {
        alert("Esta orden no cumple con los requisitos para esta promoción (Ej. No hay productos elegibles para 2x1).");
    }
  };

  const clearDiscount = () => {
      setAppliedDiscount(0);
      setActivePromo(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-2rem)] m-0 lg:m-4 gap-4 bg-slate-50">
      
      {/* Left Sidebar: Active Tables List */}
      <div className="w-full lg:w-80 bg-white rounded-none lg:rounded-2xl shadow-sm border-b lg:border border-slate-200 flex flex-col flex-shrink-0 max-h-[300px] lg:max-h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <LayoutGrid size={20} className="text-indigo-600"/>
                Cuentas Abiertas
            </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 lg:block flex gap-2 overflow-x-auto">
            {activeTables.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm w-full">No hay mesas ocupadas.</div>
            )}

            {activeTables.map(table => {
                const tableOrder = INITIAL_ORDERS.find(o => o.tableId === table.id);
                const isActive = table.id === selectedTableId;
                
                return (
                    <button
                        key={table.id}
                        onClick={() => { setSelectedTableId(table.id); clearDiscount(); }}
                        className={`w-full lg:w-full min-w-[150px] text-left p-3 rounded-xl border transition-all flex justify-between items-center group ${
                            isActive 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                    >
                        <div>
                            <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>{table.label}</p>
                            <p className={`text-xs ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                                {tableOrder ? `Orden #${tableOrder.id.split('-')[1]}` : 'Sin orden'}
                            </p>
                        </div>
                        <ChevronRight size={18} className={`transition-transform hidden lg:block ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-indigo-400'}`} />
                    </button>
                );
            })}
        </div>
      </div>

      {/* Center & Right: Order Details and Payment */}
      {order ? (
          <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
            {/* Center: Order Breakdown */}
            <div className="flex-1 bg-white lg:rounded-2xl shadow-sm border-y lg:border border-slate-200 flex flex-col overflow-hidden h-[500px] lg:h-auto">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Mesa {order.tableId.replace('t', '')}</h2>
                        <p className="text-slate-500 text-sm mt-1">Mesero: {order.waiterId} • Orden #{order.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        INITIAL_TABLES.find(t => t.id === selectedTableId)?.status === TableStatus.PAYMENT_PENDING
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                        {INITIAL_TABLES.find(t => t.id === selectedTableId)?.status === TableStatus.PAYMENT_PENDING ? 'Por Cobrar' : 'Ocupada'}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <ul className="space-y-4">
                        {order.items.map((item, i) => (
                            <li key={i} className="flex justify-between items-start pb-4 border-b border-slate-100 last:border-0">
                                <div className="flex gap-3">
                                    <div className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded font-bold text-slate-600 shrink-0">
                                        {item.quantity}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{item.name}</p>
                                        {item.notes && <p className="text-xs text-slate-400 italic">{item.notes}</p>}
                                        {/* Show discount badge on item if implementing item-level discount visibility */}
                                    </div>
                                </div>
                                <p className="font-semibold text-slate-700 ml-2">${(item.price * item.quantity).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                            <span className="flex items-center gap-1"><Tag size={14}/> Descuento ({activePromo?.name})</span>
                            <span>-${discountAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                        <span>Impoconsumo (8%)</span>
                        <span>${impoconsumo.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Propina (Voluntaria)</span>
                        <span>${order.tip.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-4 border-t border-slate-200 mt-2">
                        <span>Total a Pagar</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Right: Payment Actions */}
            <div className="w-full lg:w-96 flex flex-col gap-4 p-4 lg:p-0 pb-10">
                
                {/* Promotions Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Tag size={18} className="text-indigo-600"/> Promociones Disponibles
                    </h3>
                    <div className="space-y-2">
                        {INITIAL_PROMOTIONS.filter(p => p.isActive).map(promo => (
                             <button 
                                key={promo.id}
                                onClick={() => handleApplyPromo(promo)}
                                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-colors ${
                                    activePromo?.id === promo.id 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                    : 'border-slate-100 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                             >
                                <div className="flex justify-between">
                                    <span className="font-bold">{promo.name}</span>
                                    {activePromo?.id === promo.id && <CheckCircle2 size={14}/>}
                                </div>
                                <p className="opacity-70 mt-0.5">{promo.type === '2x1' ? '2x1 Aplicable' : `${promo.value}% Off`}</p>
                             </button>
                        ))}
                        {activePromo && (
                            <button onClick={clearDiscount} className="w-full text-center text-xs text-red-500 hover:underline mt-2">
                                Quitar descuentos
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-4">Método de Pago</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button 
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <Banknote size={24} />
                            <span className="font-medium">Efectivo</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('card')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <CreditCard size={24} />
                            <span className="font-medium">Tarjeta</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-colors flex items-center justify-center gap-2">
                            Cobrar ${total.toLocaleString()}
                        </button>
                        <button className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <Printer size={18} /> Imprimir Pre-cuenta
                        </button>
                    </div>
                </div>

                {/* Electronic Billing */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <QrCode size={20} />
                        <h3 className="font-bold">Facturación Electrónica</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        Al procesar, se enviará el XML a la DIAN y se generará el CUFE automáticamente.
                    </p>
                    
                    <div className="space-y-3">
                        <input type="text" placeholder="Cédula / NIT Cliente" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        <input type="email" placeholder="Email para envío" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium mt-2">
                            Emitir Factura Electrónica
                        </button>
                    </div>
                </div>
            </div>
          </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white lg:rounded-2xl border-y lg:border border-slate-200 shadow-sm min-h-[300px] m-4">
              <Receipt size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Selecciona una mesa para cobrar</p>
          </div>
      )}
    </div>
  );
};

export default POS;
