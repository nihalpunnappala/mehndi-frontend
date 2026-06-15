import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

const emptyForm = { date: '', category: '', amount: '', description: '', paymentMethod: '', notes: '' };

const Expenses = () => {
    const [expenses, setExpenses]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId]       = useState(null);
    const [formData, setFormData]   = useState(emptyForm);

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get('/expense');
            setExpenses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/expense/${editId}`, formData);
                toast.success('Expense updated successfully!');
            } else {
                await api.post('/expense', formData);
                toast.success('Expense added successfully!');
            }
            handleCloseModal();
            fetchExpenses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save expense.');
        }
    };

    const handleEdit = (exp) => {
        setEditId(exp._id);
        setFormData({
            date:          moment(exp.date).format('YYYY-MM-DD'),
            category:      exp.category      || '',
            amount:        exp.amount        != null ? String(exp.amount) : '',
            description:   exp.description   || '',
            paymentMethod: exp.paymentMethod || '',
            notes:         exp.notes         || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this entry?')) {
            try {
                await api.delete(`/expense/${id}`);
                toast.success('Expense deleted.');
                fetchExpenses();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete expense.');
            }
        }
    };

    const handleCloseModal = () => { setShowModal(false); setEditId(null); setFormData(emptyForm); };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-black">Expense Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all your expense entries</p>
                </div>
                <button
                    onClick={() => { setEditId(null); setFormData(emptyForm); setShowModal(true); }}
                    className="bg-black text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm font-medium flex-shrink-0"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Expense</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider text-center">
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Month</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Description</th>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-black text-center">
                            {expenses.map(exp => (
                                <tr key={exp._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">{moment(exp.date).format('MMM DD, YYYY')}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{moment(exp.date).format('MMMM')}</td>
                                    <td className="px-4 py-4">
                                        <span className="bg-gray-100 text-black px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 max-w-[160px] truncate">{exp.description}</td>
                                    <td className="px-4 py-4 font-bold whitespace-nowrap">₹{exp.amount}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(exp)} className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(exp._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">No expense entries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 md:p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-black">{editId ? 'Edit Expense' : 'Add Expense'}</h2>
                            <button onClick={handleCloseModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Date</label>
                                <input type="date" required
                                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Category</label>
                                <select required
                                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="">Select category...</option>
                                    <option>Henna Powder</option>
                                    <option>Essential Oil</option>
                                    <option>Lemon</option>
                                    <option>Piping Bag</option>
                                    <option>Cling Wrap</option>
                                    <option>Tape</option>
                                    <option>Cover</option>
                                    <option>Cellophane Sheet</option>
                                    <option>Logo Sticker</option>
                                    <option>Stencil</option>
                                    <option>Travel Expenses</option>
                                    <option>Nail Liquid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Amount (₹)</label>
                                <input type="number" required placeholder="0"
                                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Description</label>
                                <input type="text" placeholder="Optional description"
                                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Payment Method</label>
                                <select required
                                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                                    value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                                    <option value="">Select method...</option>
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                    <option>Card</option>
                                    <option>UPI</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                                    {editId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
