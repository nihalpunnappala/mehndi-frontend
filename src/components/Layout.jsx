import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const pageTitles = {
    '/':         'Dashboard',
    '/income':   'Income',
    '/expenses': 'Expenses',
    '/reports':  'Reports',
};

const Layout = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    const currentPage = pageTitles[location.pathname] || 'Dashboard';

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — hidden on mobile, shown on lg+ */}
            <div className={`
                fixed inset-y-0 left-0 z-30 lg:static lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {/* Hamburger — mobile only */}
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-sm font-semibold text-black leading-tight">Welcome, {user.name}</h2>
                            <p className="text-xs text-gray-400 hidden sm:block">{currentPage}</p>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-widest hidden sm:block">HENNA BY THAMANNA</span>
                </header>

                <main className="p-4 md:p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
