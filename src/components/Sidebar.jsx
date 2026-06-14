import { Link, useLocation } from 'react-router-dom';
import { Home, IndianRupee, PieChart, FileText, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const links = [
        { name: 'Dashboard', path: '/',        icon: Home        },
        { name: 'Income',    path: '/income',   icon: IndianRupee },
        { name: 'Expenses',  path: '/expenses', icon: PieChart    },
        { name: 'Reports',   path: '/reports',  icon: FileText    },
    ];

    const handleNav = () => {
        if (onClose) onClose();
    };

    return (
        <div className="w-64 bg-white text-black h-full flex flex-col border-r border-gray-200 shadow-sm">
            {/* Brand */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-bold tracking-wide text-black leading-snug">HENNA BY THAMANNA</h1>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Tracking System</p>
                </div>
                {/* Close button — mobile only */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={handleNav}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium group ${
                                isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                            }`}
                        >
                            <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'} />
                            <span>{link.name}</span>
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-5 pt-3 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
