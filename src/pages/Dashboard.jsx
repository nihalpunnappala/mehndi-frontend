import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { IndianRupee, PieChart as PieIcon, TrendingUp, CalendarDays } from 'lucide-react';
import { toast } from 'react-toastify';

const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 text-sm">
                <p className="font-semibold text-black mb-1">{label}</p>
                {payload.map((entry) => (
                    <p key={entry.name} className="text-gray-700">
                        {entry.name}: ₹{Number(entry.value).toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 text-sm">
                <p className="font-semibold text-black">{payload[0].name}</p>
                <p className="text-gray-600 mt-0.5">₹{Number(payload[0].value).toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const PIE_COLOR_MAP = {
    Income:  '#3B82F6',
    Expense: '#EAB308',
    Profit:  '#22C55E',
    Loss:    '#EF4444',
};

const Dashboard = () => {
    const [totals, setTotals]           = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [totalsRes, monthlyRes] = await Promise.all([
                    api.get('/reports/dashboard'),
                    api.get('/reports/monthly-summary')
                ]);
                setTotals(totalsRes.data);
                setMonthlyData(monthlyRes.data);
            } catch {
                toast.error('Failed to load dashboard data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
    );

    const summaryCards = [
        { title: 'Total Profit',      amount: totals?.netProfit,                                  icon: TrendingUp   },
        { title: 'Total Income',      amount: totals?.totalIncome,                                icon: IndianRupee  },
        { title: 'Total Expenses',    amount: totals?.totalExpense,                               icon: PieIcon      },
        { title: 'This Month Profit', amount: (totals?.thisMonthIncome ?? 0) - (totals?.thisMonthExpense ?? 0), icon: CalendarDays },
    ];

    const totalIncome  = totals?.totalIncome  ?? 0;
    const totalExpense = totals?.totalExpense ?? 0;
    const netProfit    = totals?.netProfit    ?? 0;

    const pieData = [
        { name: 'Income',  value: totalIncome  },
        { name: 'Expense', value: totalExpense },
        ...(netProfit >= 0
            ? [{ name: 'Profit', value: netProfit }]
            : [{ name: 'Loss',   value: Math.abs(netProfit) }]
        ),
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-black">Business Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Your financial snapshot at a glance</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {summaryCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 bg-white text-black hover:shadow-md transition-shadow">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-3 bg-gray-100">
                                <Icon size={18} className="text-black" />
                            </div>
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{card.title}</p>
                            <p className="text-xl md:text-2xl font-bold mt-1 text-black">₹{card.amount?.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-black mb-1">Income vs Expense</h3>
                    <p className="text-xs text-gray-400 mb-4">Monthly comparison</p>
                    <div className="h-56 md:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} width={55} />
                                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 11 }} />
                                <Bar dataKey="income"  fill="#3B82F6" radius={[4,4,0,0]} name="Income" />
                                <Bar dataKey="expense" fill="#EAB308" radius={[4,4,0,0]} name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-semibold text-black mb-1">Financial Breakdown</h3>
                    <p className="text-xs text-gray-400 mb-2">Overall income · expense · profit share</p>
                    <div className="h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="75%"
                                    innerRadius="35%"
                                    dataKey="value"
                                    labelLine={false}
                                    label={PieLabel}
                                    strokeWidth={2}
                                    stroke="#fff"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={PIE_COLOR_MAP[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-1 divide-y divide-gray-100">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between py-1.5 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: PIE_COLOR_MAP[item.name] }}></span>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <span className="font-semibold text-black">₹{Number(item.value).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
