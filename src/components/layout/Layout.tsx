import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import {
    Award,
    BookOpen,
    LayoutDashboard,
    LogOut,
    Menu,
    Users,
    X
} from 'lucide-react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    const navItems = React.useMemo(() => {
        const items = [
            { label: 'Dashboard', path: '/', icon: LayoutDashboard },
            { label: 'My Learning', path: '/my-learning', icon: BookOpen },
        ];

        // Role based items
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
            items.push(
                { label: 'Trainings', path: '/admin/trainings', icon: BookOpen },
                { label: 'Users', path: '/admin/users', icon: Users },
            );
        }

        if (user?.role === 'MANAGER') {
            items.push(
                { label: 'Team Dashboard', path: '/manager/dashboard', icon: Users },
            );
        }

        if (user?.role === 'SUPER_ADMIN') {
            items.push(
                { label: 'Approvals', path: '/super-admin/approvals', icon: Award },
            );
        }

        return items;
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' // LG always visible for now, or use state
                    } lg:translate-x-0`} // Force show on LG for this MVP
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">L&D Portal</h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 flex items-center space-x-3 mb-6 bg-slate-50 dark:bg-slate-700/50 mx-4 mt-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role.replace('_', ' ')}</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-slate-900">Dashboard</span>
                    <div className="w-8"></div> {/* Spacer */}
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
