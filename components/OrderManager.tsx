import React, { useState } from 'react';
import { Clock, CheckCircle2, ChefHat, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../constants';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-800 border-amber-200';
      case OrderStatus.COOKING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.READY: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock size={16} />;
      case OrderStatus.COOKING: return <ChefHat size={16} />;
      case OrderStatus.READY: return <CheckCircle2 size={16} />;
      case OrderStatus.DELIVERED: return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const advanceStatus = (orderId: string) => {
    setOrders(orders.map(order => {
      if (order.id !== orderId) return order;
      
      let nextStatus = order.status;
      if (order.status === OrderStatus.PENDING) nextStatus = OrderStatus.COOKING;
      else if (order.status === OrderStatus.COOKING) nextStatus = OrderStatus.READY;
      else if (order.status === OrderStatus.READY) nextStatus = OrderStatus.DELIVERED;
      
      return { ...order, status: nextStatus };
    }));
  };

  const renderColumn = (title: string, status: OrderStatus) => {
    const colOrders = orders.filter(o => o.status === status);
    
    return (
      <div className="flex-1 min-w-[300px] bg-slate-100/50 rounded-xl p-4 border border-slate-200 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">{title}</h3>
          <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-500 border border-slate-200">{colOrders.length}</span>
        </div>
        
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {colOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-lg text-slate-800">Mesa {order.tableId.replace('t', '')}</span>
                <span className="text-xs font-mono text-slate-400">#{order.id.split('-')[1]}</span>
              </div>
              
              <ul className="mb-4 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                {status !== OrderStatus.DELIVERED && (
                  <button 
                    onClick={() => advanceStatus(order.id)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md transition-colors font-medium"
                  >
                    Avanzar
                  </button>
                )}
              </div>
            </div>
          ))}
          {colOrders.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm italic">
              No hay pedidos en esta etapa
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Comandas y Cocina</h1>
        <div className="flex gap-2">
          {/* Filters could go here */}
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-160px)]">
        {renderColumn("Pendientes", OrderStatus.PENDING)}
        {renderColumn("En Cocina", OrderStatus.COOKING)}
        {renderColumn("Listos para Servir", OrderStatus.READY)}
      </div>
    </div>
  );
};

export default OrderManager;