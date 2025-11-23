
import React, { useState } from 'react';
import { 
    Building, Users, QrCode, FileText, Save, Plus, Shield, Edit2, Trash2, 
    CheckSquare, Square, Wifi, Printer
} from 'lucide-react';
import { INITIAL_SETTINGS, INITIAL_USERS, AVAILABLE_PERMISSIONS } from '../data/constants';
import { RestaurantSettings, User, UserRole, PermissionCode } from '../types';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'USERS' | 'QR' | 'BILLING'>('GENERAL');
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionCode[]>([]);

  const handleSaveSettings = () => {
      alert("Configuración guardada exitosamente.");
  };

  const handleOpenUserModal = (user?: User) => {
      if (user) {
          setEditingUser(user);
          setSelectedPermissions(user.permissions);
      } else {
          setEditingUser({ role: UserRole.WAITER, active: true, permissions: [] });
          setSelectedPermissions([]);
      }
      setIsUserModalOpen(true);
  };

  const togglePermission = (code: PermissionCode) => {
      setSelectedPermissions(prev => 
          prev.includes(code) 
          ? prev.filter(p => p !== code) 
          : [...prev, code]
      );
  };

  const handleSaveUser = () => {
      if (!editingUser?.name || !editingUser?.email) return;
      
      const newUser: User = {
          id: editingUser.id || `usr-${Date.now()}`,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role || UserRole.WAITER,
          active: editingUser.active ?? true,
          permissions: selectedPermissions
      };

      if (editingUser.id) {
          setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
      } else {
          setUsers([...users, newUser]);
      }
      setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
      if (confirm("¿Estás seguro de eliminar este usuario?")) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const renderGeneralTab = () => (
      <div className="max-w-3xl space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Building size={20} className="text-indigo-600"/> Datos del Restaurante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Establecimiento</label>
                      <input 
                          type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NIT / RUC / ID Fiscal</label>
                      <input 
                          type="text" value={settings.nit} onChange={e => setSettings({...settings, nit: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección Física</label>
                      <input 
                          type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono Contacto</label>
                      <input 
                          type="tel" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600"/> Impuestos y Propina
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Impuesto</label>
                      <select 
                          value={settings.taxName} onChange={e => setSettings({...settings, taxName: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                      >
                          <option value="Impoconsumo">Impoconsumo</option>
                          <option value="IVA">IVA</option>
                          <option value="Tax">Tax (Genérico)</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Porcentaje Impuesto (%)</label>
                      <input 
                          type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: Number(e.target.value)})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">% Propina Sugerida</label>
                      <input 
                          type="number" value={settings.tipRate} onChange={e => setSettings({...settings, tipRate: Number(e.target.value)})}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                      />
                  </div>
              </div>
          </div>

          <div className="flex justify-end">
              <button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-colors">
                  <Save size={20} /> Guardar Cambios
              </button>
          </div>
      </div>
  );

  const renderUsersTab = () => (
      <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center">
              <p className="text-slate-500">Administra el equipo, asigna roles y permisos específicos.</p>
              <button onClick={() => handleOpenUserModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Plus size={18} /> Nuevo Usuario
              </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Rol</th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Permisos</th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {users.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                  <p className="font-bold text-slate-800">{user.name}</p>
                                  <p className="text-xs text-slate-400">{user.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                      user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                      user.role === UserRole.INVENTORY ? 'bg-amber-100 text-amber-700' :
                                      'bg-slate-100 text-slate-700'
                                  }`}>
                                      {user.role}
                                  </span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                      {user.permissions.slice(0, 3).map(p => (
                                          <span key={p} className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                              {p.split('_')[1]}
                                          </span>
                                      ))}
                                      {user.permissions.length > 3 && (
                                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                              +{user.permissions.length - 3}
                                          </span>
                                      )}
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleOpenUserModal(user)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg mr-2"><Edit2 size={18}/></button>
                                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderQRTab = () => (
      <div className="max-w-4xl animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col items-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{settings.name}</h3>
                  <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                      <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://restoflow.app/menu/${settings.nit}`} 
                          alt="Menu QR Code" 
                          className="w-48 h-48"
                      />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Escanea para ver el Menú Digital</p>
                  <div className="flex gap-2 mt-6">
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                          <Printer size={16}/> Imprimir PDF
                      </button>
                      <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-200">
                          Descargar PNG
                      </button>
                  </div>
              </div>

              <div className="space-y-6">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Menú Digital sin Contacto</h2>
                      <p className="text-slate-500">
                          Tus clientes pueden acceder al menú completo escaneando este código QR. 
                          Colócalo en las mesas, en la entrada o en los volantes publicitarios.
                      </p>
                  </div>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><Wifi size={20}/></div>
                          <div>
                              <h4 className="font-bold text-slate-700">Datos WiFi para Clientes</h4>
                              <p className="text-sm text-slate-500">Puedes incluir esto en la tarjeta del QR.</p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                  <input type="text" placeholder="SSID (Nombre Red)" value={settings.wifiSSID} onChange={e=>setSettings({...settings, wifiSSID: e.target.value})} className="border p-2 rounded text-sm"/>
                                  <input type="text" placeholder="Contraseña" value={settings.wifiPass} onChange={e=>setSettings({...settings, wifiPass: e.target.value})} className="border p-2 rounded text-sm"/>
                              </div>
                          </div>
                      </div>
                  </div>
                  <button onClick={handleSaveSettings} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold">
                      Actualizar Datos del QR
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-indigo-600" />
            Configuración Maestra
          </h1>
          <p className="text-slate-500 text-sm">Control total del sistema, usuarios y parámetros fiscales.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('GENERAL')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'GENERAL' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
              <Building size={18}/> General & Fiscal
          </button>
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'USERS' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
              <Users size={18}/> Usuarios & Permisos
          </button>
          <button 
            onClick={() => setActiveTab('QR')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'QR' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
              <QrCode size={18}/> Menú QR
          </button>
      </div>

      <div className="min-h-[400px]">
          {activeTab === 'GENERAL' && renderGeneralTab()}
          {activeTab === 'USERS' && renderUsersTab()}
          {activeTab === 'QR' && renderQRTab()}
      </div>

      {isUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="text-xl font-bold text-slate-800">
                          {editingUser.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                      </h3>
                      <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          Cerrar
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                              <input 
                                  type="text" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Login)</label>
                              <input 
                                  type="email" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rol Principal</label>
                              <select 
                                  value={editingUser.role} 
                                  onChange={e => {
                                      const newRole = e.target.value as UserRole;
                                      setEditingUser({...editingUser, role: newRole});
                                  }}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                              >
                                  <option value={UserRole.ADMIN}>Administrador (Dueño)</option>
                                  <option value={UserRole.WAITER}>Mesero</option>
                                  <option value={UserRole.CASHIER}>Cajero</option>
                                  <option value={UserRole.KITCHEN}>Cocina</option>
                                  <option value={UserRole.INVENTORY}>Jefe de Bodega</option>
                              </select>
                          </div>
                          <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={editingUser.active} 
                                        onChange={e => setEditingUser({...editingUser, active: e.target.checked})}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="font-medium text-slate-700">Usuario Activo</span>
                                </label>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                              <Shield size={18} className="text-indigo-600"/> Permisos Específicos
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {AVAILABLE_PERMISSIONS.map((perm) => (
                                  <div 
                                    key={perm.code} 
                                    onClick={() => togglePermission(perm.code)}
                                    className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                                        selectedPermissions.includes(perm.code) 
                                        ? 'bg-indigo-50 border-indigo-200' 
                                        : 'bg-white border-slate-200 hover:border-indigo-200'
                                    }`}
                                  >
                                      <div className={`mt-0.5 ${selectedPermissions.includes(perm.code) ? 'text-indigo-600' : 'text-slate-300'}`}>
                                          {selectedPermissions.includes(perm.code) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                      </div>
                                      <div>
                                          <p className={`text-sm font-bold ${selectedPermissions.includes(perm.code) ? 'text-indigo-700' : 'text-slate-700'}`}>
                                              {perm.label}
                                          </p>
                                          <p className="text-[10px] text-slate-400 uppercase mt-0.5">{perm.category}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                      <button onClick={() => setIsUserModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200">
                          Cancelar
                      </button>
                      <button onClick={handleSaveUser} className="px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                          Guardar Usuario
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SettingsManager;
