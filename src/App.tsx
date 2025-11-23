
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuManager from './pages/MenuManager';
import InventoryManager from './pages/InventoryManager';
import KitchenDisplay from './pages/KitchenDisplay';
import TableMap from './pages/TableMap';
import OrderEntry from './pages/OrderEntry';
import POS from './pages/POS';
import ReservationManager from './pages/ReservationManager';
import AdminFinance from './pages/AdminFinance';
import SettingsManager from './pages/SettingsManager';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 relative">
        <div className="hidden md:block h-screen sticky top-0">
             <Sidebar />
        </div>

        {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto h-screen relative w-full">
          <div className="md:hidden bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <span className="font-bold text-indigo-600 text-lg">RestoFlow</span>
            </div>
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-finance" element={<AdminFinance />} />
            <Route path="/menu" element={<MenuManager />} />
            <Route path="/inventory" element={<InventoryManager />} />
            <Route path="/kitchen" element={<KitchenDisplay />} />
            <Route path="/tables" element={<TableMap />} />
            <Route path="/table/:tableId/order" element={<OrderEntry />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/reservations" element={<ReservationManager />} />
            <Route path="/settings" element={<SettingsManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
