
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, Plus, Trash2, CheckCircle2, X, Eye, FileText } from 'lucide-react';
import { INITIAL_RESERVATIONS, INITIAL_TABLES } from '../constants';
import { Reservation, TableStatus } from '../types';

const ReservationManager: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState<Reservation | null>(null);
  const [newRes, setNewRes] = useState<Partial<Reservation>>({
    date: new Date(),
    status: 'CONFIRMED',
    pax: 2,
    preOrderDetails: ''
  });

  const availableTables = INITIAL_TABLES.filter(t => t.status === TableStatus.AVAILABLE || t.status === TableStatus.RESERVED);

  const handleAddReservation = () => {
    if (!newRes.customerName || !newRes.time) return;
    
    const reservation: Reservation = {
        id: `res-${Date.now()}`,
        customerName: newRes.customerName,
        customerPhone: newRes.customerPhone,
        date: newRes.date || new Date(),
        time: newRes.time,
        pax: newRes.pax || 2,
        tableId: newRes.tableId,
        status: 'CONFIRMED',
        notes: newRes.notes,
        preOrderDetails: newRes.preOrderDetails
    };

    setReservations([...reservations, reservation]);
    setIsModalOpen(false);
    setNewRes({ date: new Date(), status: 'CONFIRMED', pax: 2, preOrderDetails: '' });
  };

  const handleDelete = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-indigo-600" />
            Gestión de Reservas
          </h1>
          <p className="text-slate-500 text-sm">Administra el libro de reservas y asignación de mesas.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors"
        >
            <Plus size={18} /> Nueva Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-3 space-y-4">
            {reservations.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
                    <CalendarIcon size={48} className="mx-auto mb-2 opacity-20"/>
                    <p>No hay reservas registradas.</p>
                </div>
            )}
            
            {reservations.sort((a,b) => a.time.localeCompare(b.time)).map(res => (
                <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 flex-1">
                        <div className="bg-indigo-50 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-indigo-700 border border-indigo-100 shrink-0">
                            <span className="text-xs font-bold uppercase">{formatDate(res.date)}</span>
                            <span className="text-lg font-bold">{res.time}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                {res.customerName}
                                {res.preOrderDetails && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                                        <FileText size={10}/> Pre-orden
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><User size={14}/> {res.pax} pax</span>
                                {res.customerPhone && <span className="flex items-center gap-1"><Phone size={14}/> {res.customerPhone}</span>}
                                {res.tableId && <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">Mesa {res.tableId.replace('t','')}</span>}
                            </div>
                            {res.notes && <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">Nota: {res.notes}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                         {res.preOrderDetails && (
                             <button onClick={() => setViewDetailsModal(res)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Ver Pre-orden">
                                 <Eye size={18} />
                             </button>
                         )}
                         {res.status === 'CONFIRMED' ? (
                             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                 <CheckCircle2 size={14}/> Confirmada
                             </span>
                         ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                {res.status}
                            </span>
                         )}
                         <button onClick={() => handleDelete(res.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 ml-2">
                             <Trash2 size={18} />
                         </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
                    <h3 className="font-bold">Nueva Reserva</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Cliente</label>
                        <input 
                            type="text" autoFocus
                            value={newRes.customerName || ''} 
                            onChange={e => setNewRes({...newRes, customerName: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input 
                                type="tel" 
                                value={newRes.customerPhone || ''} 
                                onChange={e => setNewRes({...newRes, customerPhone: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Personas (Pax)</label>
                            <input 
                                type="number" 
                                value={newRes.pax || 2} 
                                onChange={e => setNewRes({...newRes, pax: Number(e.target.value)})}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                            <input 
                                type="date" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label>
                            <input 
                                type="time" 
                                value={newRes.time || ''} 
                                onChange={e => setNewRes({...newRes, time: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asignar Mesa (Opcional)</label>
                        <select 
                            value={newRes.tableId || ''} 
                            onChange={e => setNewRes({...newRes, tableId: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Sin asignar</option>
                            {availableTables.map(t => (
                                <option key={t.id} value={t.id}>{t.label} ({t.capacity} pax)</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FileText size={16}/> Detalles de Servicio (Opcional)
                        </h4>
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas Generales</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. Cumpleaños, alergias..."
                                    value={newRes.notes || ''} 
                                    onChange={e => setNewRes({...newRes, notes: e.target.value})}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pre-orden / Platos Específicos</label>
                                <textarea 
                                    value={newRes.preOrderDetails || ''} 
                                    onChange={e => setNewRes({...newRes, preOrderDetails: e.target.value})}
                                    rows={3}
                                    placeholder="Listado de platos pre-ordenados o requerimientos complejos..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddReservation}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-colors mt-2"
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Pre-Order Details Modal */}
      {viewDetailsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><FileText size={20}/> Detalles de Pre-orden</h3>
                    <button onClick={() => setViewDetailsModal(null)}><X size={20}/></button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Cliente</p>
                        <p className="font-bold text-slate-800 text-lg">{viewDetailsModal.customerName}</p>
                    </div>
                    {viewDetailsModal.notes && (
                        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Notas Generales</p>
                            <p className="text-slate-700">{viewDetailsModal.notes}</p>
                        </div>
                    )}
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <p className="text-xs text-amber-800 uppercase font-bold mb-2">Platos Pre-ordenados / Requerimientos</p>
                        <p className="text-slate-800 whitespace-pre-wrap">{viewDetailsModal.preOrderDetails}</p>
                    </div>
                    <div className="mt-6">
                        <button onClick={() => setViewDetailsModal(null)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-bold transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ReservationManager;
