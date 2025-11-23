import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Users, Sparkles, Loader2 } from 'lucide-react';
import { MOCK_SALES_DATA } from '../constants';
import { analyzeBusinessPerformance } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    // Initial simulation of loading insights
    // In a real app, this would happen on demand or load
  }, []);

  const handleAnalyze = async () => {
    setLoadingAI(true);
    const result = await analyzeBusinessPerformance(MOCK_SALES_DATA);
    setInsights(result.insights);
    setStrategy(result.strategy);
    setLoadingAI(false);
  };

  const totalSales = MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.sales, 0);
  const totalOrders = MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ventas Totales (Semana)</p>
              <p className="text-2xl font-bold text-slate-800">${totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Pedidos</p>
              <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ticket Promedio</p>
              <p className="text-2xl font-bold text-slate-800">${(totalSales / totalOrders).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & AI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Tendencia de Ventas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Ventas']}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Gemini Insights
            </h2>
            <button 
              onClick={handleAnalyze}
              disabled={loadingAI}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
            >
              {loadingAI ? 'Analizando...' : 'Analizar Datos'}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-lg p-4 overflow-y-auto">
            {insights.length === 0 && !loadingAI && !strategy && (
              <div className="text-center text-slate-400 mt-10">
                <p>Haz clic en "Analizar Datos" para obtener reportes de IA sobre tu rendimiento.</p>
              </div>
            )}

            {loadingAI && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <Loader2 className="animate-spin" size={24} />
                <p className="text-sm">Gemini está estudiando tus números...</p>
              </div>
            )}

            {(insights.length > 0 || strategy) && !loadingAI && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Observaciones</h3>
                  <ul className="space-y-2">
                    {insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {strategy && (
                  <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                    <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Estrategia Recomendada</h3>
                    <p className="text-sm text-indigo-900 italic">"{strategy}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;