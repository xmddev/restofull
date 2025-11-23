
import React, { useState } from 'react';
import { Clock, CheckCircle2, ChefHat, Flame, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/constants';

const KitchenDisplay: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const kitchenOrders = orders.filter(o => 
    o.status === OrderStatus.PENDING || 
    o.status === OrderStatus.COOKING
  );

  const advanceStatus = (orderId: string) => {
    setOrders(orders.map(order => {
      if (order.id !== orderId) return order;
      const next = order.status === OrderStatus.PENDING ? OrderStatus.COOKING : OrderStatus.READY;
      return { ...order, status: next };
    }));
  };

  const getElapsedMinutes = (date: Date) => {
    return Math.floor((new Date().getTime() - date.getTime()) / 60000);
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-100">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
            <ChefHat className="text-amber-500" size={32} />
            <div>
                <h1 className="text-2xl font-bold">KDS - Cocina</h1>
                <p className="text-slate-400 text-sm">Sistema de Visualización de Cocina</p>
            </div>
        </div>
        <div className="flex gap-4 text-sm">
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-amber-500 font-bold text-lg mr-2">{kitchenOrders.filter(o => o.status === OrderStatus.PENDING).length}</span>
                Pendientes
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-blue-400 font-bold text-lg mr-2">{kitchenOrders.filter(o => o.status === OrderStatus.COOKING).length}</span>
                En Preparación
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kitchenOrders.map(order => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isLate = elapsed > 20;
            
            return (
                <div key={order.id} className={`bg-slate-800 rounded-xl overflow-hidden border-l-4 flex flex-col ${
                    order.status === OrderStatus.PENDING ? 'border-amber-500' : 'border-blue-500'
                }`}>
                    <div className={`p-3 flex justify-between items-center ${isLate ? 'bg-red-900/30' : 'bg-slate-700/50'}`}>
                        <h3 className="font-bold text-xl">Mesa {order.tableId.replace('t', '')}</h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${isLate ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                            <Clock size={14} />
                            <span className="font-mono font-bold">{elapsed}m</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
                        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                            <span>Mesero: {order.waiterId}</span>
                            <span>#{order.id.split('-')[1]}</span>
                        </div>
                        <ul className="space-y-3">
                            {order.items.map((item, idx) => (
                                <li key={idx} className="border-b border-slate-700 pb-2 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-lg text-white">{item.quantity}x</span>
                                        <span className="flex-1 ml-3 text-slate-200 text-lg">{item.name}</span>
                                    </div>
                                    {item.notes && (
                                        <div className="mt-1 ml-8 text-amber-400 text-sm italic flex items-start gap-1">
                                            <AlertTriangle size={12} className="mt-1" />
                                            {item.notes}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-3 bg-slate-800 border-t border-slate-700">
                        <button 
                            onClick={() => advanceStatus(order.id)}
                            className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                                order.status === OrderStatus.PENDING 
                                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {order.status === OrderStatus.PENDING ? (
                                <> <Flame size={20} /> Empezar </>
                            ) : (
                                <> <CheckCircle2 size={20} /> Terminar </>
                            )}
                        </button>
                    </div>
                </div>
            );
        })}
        
        {kitchenOrders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center h-96 text-slate-600">
                <CheckCircle2 size={64} className="mb-4 opacity-20" />
                <p className="text-xl font-medium">Todo al día, Chef.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
