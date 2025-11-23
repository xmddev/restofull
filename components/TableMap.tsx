
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, DollarSign, CalendarClock, Utensils, ChevronRight } from 'lucide-react';
import { INITIAL_TABLES } from '../constants';
import { TableStatus } from '../types';

const TableMap: React.FC = () => {
  const navigate = useNavigate();
  const [tables] = useState(INITIAL_TABLES);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-emerald-100 border-emerald-300 text-emerald-800'; // 🟢 Libre
      case TableStatus.OCCUPIED: return 'bg-red-100 border-red-300 text-red-800'; // 🔴 Ocupada
      case TableStatus.RESERVED: return 'bg-amber-100 border-amber-300 text-amber-800'; // 🟡 Reservada
      case TableStatus.PAYMENT_PENDING: return 'bg-blue-100 border-blue-300 text-blue-800'; // 🔵 Por cobrar
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'Libre';
      case TableStatus.OCCUPIED: return 'Ocupada';
      case TableStatus.RESERVED: return 'Reservada';
      case TableStatus.PAYMENT_PENDING: return 'Facturar';
    }
  };

  const getActionText = (status: TableStatus) => {
      if (status === TableStatus.AVAILABLE) return 'Abrir Mesa';
      if (status === TableStatus.OCCUPIED) return 'Ver Comanda';
      if (status === TableStatus.RESERVED) return 'Gestionar Reserva';
      if (status === TableStatus.PAYMENT_PENDING) return 'Ir a Caja';
      return 'Ver';
  };

  const handleTableClick = (tableId: string) => {
    navigate(`/table/${tableId}/order`);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Sala</h1>
            <p className="text-slate-500 text-sm">Vista en tiempo real del estado de las mesas.</p>
        </div>
        {/* Legend - Hidden on very small screens */}
        <div className="flex gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-600">Libre</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="text-xs text-slate-600">Ocupada</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-xs text-slate-600">Reservada</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                <span className="text-xs text-slate-600">Por Cobrar</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[120px] md:auto-rows-[140px]">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table.id)}
            className={`relative rounded-2xl border-2 p-3 md:p-4 flex flex-col justify-between transition-all transform active:scale-95 hover:-translate-y-1 hover:shadow-lg group overflow-hidden cursor-pointer ${getStatusColor(table.status)}`}
          >
            <div className="flex justify-between w-full items-start z-10">
                <span className="font-bold text-lg md:text-xl tracking-tight truncate">{table.label}</span>
                <div className="flex items-center gap-1 text-sm font-medium opacity-80">
                    <Users size={14} />
                    <span>{table.capacity}</span>
                </div>
            </div>

            <div className="w-full z-10">
                {table.status === TableStatus.RESERVED && table.reservationInfo ? (
                    <div className="mb-2">
                        <div className="flex items-center gap-1 text-amber-900 font-bold text-xs md:text-sm">
                            <CalendarClock size={14} />
                            <span>{table.reservationInfo.time}</span>
                        </div>
                        <p className="text-xs text-amber-800 truncate">{table.reservationInfo.name}</p>
                    </div>
                ) : (
                    <div className="flex justify-between items-end">
                        <div className="text-left">
                            <p className="text-[10px] md:text-xs font-bold uppercase opacity-60 tracking-wider">Estado</p>
                            <p className="font-semibold text-xs md:text-sm">{getStatusLabel(table.status)}</p>
                        </div>
                        {/* Mobile: Show small icon instead of hover text if needed */}
                        {table.status === TableStatus.OCCUPIED && <Clock size={18} className="opacity-50" />}
                        {table.status === TableStatus.PAYMENT_PENDING && <DollarSign size={18} className="opacity-50" />}
                    </div>
                )}
            </div>
            
            {/* Hover Overlay - Only for desktop. On mobile, the whole card click is the action. */}
            <div 
                className="absolute inset-0 bg-white/90 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md font-bold text-sm transform scale-95 group-hover:scale-100 transition-transform ${
                    table.status === TableStatus.AVAILABLE ? 'bg-emerald-600 text-white' :
                    table.status === TableStatus.OCCUPIED ? 'bg-red-600 text-white' :
                    table.status === TableStatus.RESERVED ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                    {table.status === TableStatus.AVAILABLE && <Utensils size={16} />}
                    {table.status === TableStatus.OCCUPIED && <ChevronRight size={16} />}
                    {getActionText(table.status)}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableMap;
