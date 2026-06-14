import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, CalendarDays } from 'lucide-react';

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-sm">
                <p className="font-semibold text-black mb-2">{label}</p>
                {payload.map((entry) => (
                    <p key={entry.name} className="text-gray-700 font-medium">
                        {entry.name}: ₹{Number(entry.value).toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Reports = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await api.get('/reports/monthly-summary');
                setMonthlyData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
    );

    // ── Totals ────────────────────────────────────────────────────────────────
    const totalIncome  = monthlyData.reduce((s, d) => s + d.income, 0);
    const totalExpense = monthlyData.reduce((s, d) => s + d.expense, 0);
    const netProfit    = totalIncome - totalExpense;
    const isProfit     = netProfit >= 0;

    const summaryCards = [
        { title: 'Total Income',    value: totalIncome,            icon: IndianRupee,                        },
        { title: 'Total Expense',   value: totalExpense,           icon: ShoppingCart,                       },
        { title: isProfit ? 'Net Profit' : 'Net Loss',
                                    value: Math.abs(netProfit),    icon: isProfit ? TrendingUp : TrendingDown },
        { title: 'Months Tracked',  value: monthlyData.length,     icon: CalendarDays, isCount: true         },
    ];

    return (
        <div className="space-y-8 bg-white min-h-screen">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-black">Financial Reports</h1>
                <p className="text-gray-500 mt-1 text-sm">Month-by-month breakdown of income, expenses, profit &amp; loss</p>
            </div>

            {/* ── Summary Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {summaryCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                            <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Icon size={20} className="text-black" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <p className="text-2xl font-bold mt-1 text-black">
                                    {card.isCount ? card.value : `₹${Number(card.value).toLocaleString()}`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Charts ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-black mb-1">Monthly Overview</h3>
                    <p className="text-xs text-gray-400 mb-5">Income · Expense · Profit/Loss</p>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                                <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                                <Bar dataKey="income"  fill="#3B82F6" radius={[4,4,0,0]} name="Income" />
                                <Bar dataKey="expense" fill="#EAB308" radius={[4,4,0,0]} name="Expense" />
                                <Bar dataKey="profit"  fill="#22C55E" radius={[4,4,0,0]} name="Profit/Loss" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-black mb-1">Profit / Loss Trend</h3>
                    <p className="text-xs text-gray-400 mb-5">Net result per month</p>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                                <Line type="monotone" dataKey="income"  stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} name="Income" />
                                <Line type="monotone" dataKey="expense" stroke="#EAB308" strokeWidth={2.5} dot={{ r: 4, fill: '#EAB308' }} activeDot={{ r: 6 }} name="Expense" />
                                <Line type="monotone" dataKey="profit"  stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4, fill: '#22C55E' }} activeDot={{ r: 6 }} name="Profit" strokeDasharray="5 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Table header bar */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-black">Detailed Monthly Breakdown</h3>
                        <p className="text-xs text-gray-400 mt-0.5">All figures in Indian Rupees (₹)</p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Income
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>Expense
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Profit
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Loss
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider text-center">
                                <th className="px-6 py-3 font-semibold">Month</th>
                                <th className="px-6 py-3 font-semibold">Total Income</th>
                                <th className="px-6 py-3 font-semibold">Total Expense</th>
                                <th className="px-6 py-3 font-semibold">Net Profit</th>
                                <th className="px-6 py-3 font-semibold">Net Loss</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 text-sm">
                            {monthlyData.map((row) => {
                                const profit = row.profit;
                                const isProfitRow = profit >= 0;
                                return (
                                    <tr key={row.month} className="hover:bg-gray-50 transition-colors text-center">
                                        <td className="px-6 py-4 font-semibold text-black">{row.month}</td>
                                        <td className="px-6 py-4 text-black font-medium">₹{Number(row.income).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-black font-medium">₹{Number(row.expense).toLocaleString()}</td>

                                        {/* Profit – green badge */}
                                        <td className="px-6 py-4 text-center">
                                            {isProfitRow ? (
                                                <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 font-semibold rounded-lg text-xs">
                                                    <TrendingUp size={12} />
                                                    ₹{Number(profit).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>

                                        {/* Loss – red badge */}
                                        <td className="px-6 py-4 text-center">
                                            {!isProfitRow ? (
                                                <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 font-semibold rounded-lg text-xs">
                                                    <TrendingDown size={12} />
                                                    ₹{Number(Math.abs(profit)).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                isProfitRow
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {isProfitRow ? '✓ Profitable' : '✗ In Loss'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Grand Total */}
                        <tfoot>
                            <tr className="bg-gray-100 border-t-2 border-gray-200 text-sm font-bold text-center">
                                <td className="px-6 py-4 text-black">Grand Total</td>
                                <td className="px-6 py-4 text-black">₹{Number(totalIncome).toLocaleString()}</td>
                                <td className="px-6 py-4 text-black">₹{Number(totalExpense).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {isProfit
                                        ? <span className="text-green-600">₹{Number(netProfit).toLocaleString()}</span>
                                        : <span className="text-gray-300">—</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    {!isProfit
                                        ? <span className="text-red-600">₹{Number(Math.abs(netProfit)).toLocaleString()}</span>
                                        : <span className="text-gray-300">—</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {isProfit ? '✓ Profitable' : '✗ In Loss'}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
