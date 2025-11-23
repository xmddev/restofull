
import React, { useState } from 'react';
import { 
    TrendingUp, TrendingDown, DollarSign, FileText, Plus, Trash2, 
    PieChart, AlertCircle, Wallet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie } from 'recharts';
import { Expense, ExpenseCategory, TransactionType } from '../types';
import { INITIAL_EXPENSES, INITIAL_ORDERS, INITIAL_TRANSACTIONS } from '../constants';

const AdminFinance: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    // Form State
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        description: '', amount: 0, category: 'OTHER', paymentMethod: 'CASH'
    });

    // 1. Calculate TOTAL INCOME (From Orders)
    const totalIncome = INITIAL_ORDERS.reduce((acc, order) => acc + order.total, 0);

    // 2. Calculate COGS (Cost of Goods Sold - From Purchases in Inventory)
    // We assume 'Purchase' transactions are the Cost.
    const totalPurchases = INITIAL_TRANSACTIONS
        .filter(t => t.type === TransactionType.PURCHASE)
        .reduce((acc, t) => acc + t.totalValue, 0);

    // 3. Calculate OPEX (Operational Expenses)
    const totalOpEx = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // 4. Net Profit
    const totalExpenses = totalPurchases + totalOpEx;
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = (netProfit / totalIncome) * 100;

    // 5. Chart Data
    const pnlData = [
        { name: 'Ventas', value: totalIncome, color: '#10b981' }, // Emerald
        { name: 'Costo Insumos', value: totalPurchases, color: '#f59e0b' }, // Amber
        { name: 'Gastos Op.', value: totalOpEx, color: '#ef4444' }, // Red
        { name: 'Utilidad', value: netProfit, color: '#6366f1' }, // Indigo
    ];

    const handleAddExpense = () => {
        if (!newExpense.description || !newExpense.amount) return;
        const expense: Expense = {
            id: `exp-${Date.now()}`,
            description: newExpense.description,
            amount: Number(newExpense.amount),
            category: newExpense.category as ExpenseCategory,
            paymentMethod: newExpense.paymentMethod as any,
            date: new Date(),
            registeredBy: 'Admin'
        };
        setExpenses([expense, ...expenses]);
        setIsExpenseModalOpen(false);
        setNewExpense({ description: '', amount: 0, category: 'OTHER', paymentMethod: 'CASH' });
    };

    const deleteExpense = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wallet className="text-indigo-600" />
                        Finanzas & Administración
                    </h1>
                    <p className="text-slate-500 text-sm">Control de Gastos, P&L y Flujo de Caja.</p>
                </div>
                <button 
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors"
                >
                    <TrendingDown size={18} /> Registrar Gasto
                </button>
            </div>

            {/* 1. P&L CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Ingresos (Ventas)</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">${totalIncome.toLocaleString()}</h3>
                        </div>
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><TrendingUp size={20}/></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Compras (Insumos)</p>
                            <h3 className="text-2xl font-bold text-amber-600 mt-1">${totalPurchases.toLocaleString()}</h3>
                        </div>
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><DollarSign size={20}/></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Gastos Operativos</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">${totalOpEx.toLocaleString()}</h3>
                        </div>
                        <div className="bg-red-100 p-2 rounded-lg text-red-600"><TrendingDown size={20}/></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Utilidad Neta</p>
                            <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                                ${netProfit.toLocaleString()}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Margen: {profitMargin.toFixed(1)}%</p>
                        </div>
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><PieChart size={20}/></div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full z-0"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. CHARTS */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-6">Estado de Resultados (Estimado)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pnlData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                    {pnlData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. EXPENSES LIST */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                        <span>Historial de Gastos</span>
                        <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                            {expenses.length} regs
                        </span>
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {expenses.length === 0 && (
                            <div className="text-center py-10 text-slate-400 text-sm">No hay gastos registrados.</div>
                        )}
                        {expenses.map(exp => (
                            <div key={exp.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex justify-between group">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{exp.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">{exp.category}</span>
                                        <span className="text-xs text-slate-400">{exp.date.toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600 text-sm">-${exp.amount.toLocaleString()}</p>
                                    <button 
                                        onClick={() => deleteExpense(exp.id)}
                                        className="text-slate-300 hover:text-red-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ADD EXPENSE MODAL */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingDown className="text-red-600" /> Nuevo Gasto Operativo
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="Ej. Pago Recibo Luz"
                                    value={newExpense.description} 
                                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monto ($)</label>
                                    <input 
                                        type="number" 
                                        value={newExpense.amount || ''} 
                                        onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                                    <select 
                                        value={newExpense.category} 
                                        onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                    >
                                        <option value="SERVICES">Servicios Públicos</option>
                                        <option value="PAYROLL">Nómina / Turnos</option>
                                        <option value="RENT">Arriendo</option>
                                        <option value="MAINTENANCE">Mantenimiento</option>
                                        <option value="MARKETING">Marketing</option>
                                        <option value="OTHER">Otros</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Método de Pago</label>
                                <div className="flex gap-2">
                                    {['CASH', 'TRANSFER', 'CARD'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setNewExpense({...newExpense, paymentMethod: method as any})}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                                                newExpense.paymentMethod === method 
                                                ? 'bg-red-50 border-red-500 text-red-700' 
                                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            {method === 'CASH' ? 'Efectivo' : method === 'TRANSFER' ? 'Transf.' : 'Tarjeta'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={() => setIsExpenseModalOpen(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleAddExpense}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                                >
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinance;
