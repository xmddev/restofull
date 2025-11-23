
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ChefHat, 
  Settings, 
  Store, 
  Grid3X3, 
  Receipt, 
  UserCircle,
  TabletSmartphone,
  PackageSearch,
  CalendarDays,
  Wallet
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
    className?: string;
    onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", onLinkClick }) => {
  const location = useLocation();
  // Simulation of Auth State from Clerk
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);

  const allMenuItems = [
    { 
      path: '/', 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard',
      roles: [UserRole.ADMIN] 
    },
    { 
      path: '/admin-finance', 
      icon: <Wallet size={20} />, 
      label: 'Finanzas', 
      roles: [UserRole.ADMIN] 
    },
    { 
      path: '/menu', 
      icon: <UtensilsCrossed size={20} />, 
      label: 'Gestión Menú', 
      roles: [UserRole.ADMIN] 
    },
    { 
      path: '/inventory', 
      icon: <PackageSearch size={20} />, 
      label: 'Inventario', 
      roles: [UserRole.ADMIN, UserRole.INVENTORY] 
    },
    { 
      path: '/tables', 
      icon: <Grid3X3 size={20} />, 
      label: 'Mesas (Sala)', 
      roles: [UserRole.WAITER, UserRole.CASHIER, UserRole.ADMIN] // Admin can see it if needed, or remove if strict
    },
    { 
      path: '/reservations', 
      icon: <CalendarDays size={20} />, 
      label: 'Reservas', 
      roles: [UserRole.WAITER, UserRole.ADMIN] 
    },
    { 
      path: '/kitchen', 
      icon: <ChefHat size={20} />, 
      label: 'Cocina (KDS)', 
      roles: [UserRole.KITCHEN, UserRole.ADMIN]
    },
    { 
      path: '/pos', 
      icon: <Receipt size={20} />, 
      label: 'Caja / POS', 
      roles: [UserRole.CASHIER, UserRole.ADMIN]
    },
  ];

  const visibleItems = allMenuItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className={`w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 ${className}`}>
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Store size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 tracking-tight leading-none">RestoFlow</h1>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">SaaS Edition</span>
        </div>
      </div>

      {/* Role Switcher for Demo Purposes */}
      <div className="px-4 pt-4">
        <div className="bg-slate-100 p-2 rounded-lg mb-2">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase px-1">Simular Rol:</p>
          <select 
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="w-full text-sm p-2 rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.WAITER}>Mesero</option>
            <option value={UserRole.KITCHEN}>Cocina / Bar</option>
            <option value={UserRole.CASHIER}>Cajero</option>
            <option value={UserRole.INVENTORY}>Jefe Bodega</option>
          </select>
        </div>
        
        {/* Mobile/Tablet Mode Launcher - Only for Operational Roles */}
        {(currentRole === UserRole.WAITER || currentRole === UserRole.CASHIER) && (
            <Link to="/tables" onClick={onLinkClick} className="block">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                    <TabletSmartphone size={18} />
                    <span className="text-sm font-bold">Modo Tablet</span>
                </button>
            </Link>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        {currentRole === UserRole.ADMIN && (
            <Link 
                to="/settings"
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors mb-4 ${
                    location.pathname === '/settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
                <Settings size={20} />
                <span>Configuración</span>
            </Link>
        )}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
          <UserCircle className="text-slate-400" size={32} />
          <div>
            <p className="text-xs font-bold text-slate-700">Usuario Demo</p>
            <p className="text-[10px] text-indigo-600 font-mono uppercase">{currentRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
