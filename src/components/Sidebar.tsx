'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Calendar,
    DollarSign,
    FileText,
    Settings,
    Building2,
    Clock,
    BarChart3,
    User,
} from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: ('admin' | 'employee')[];
}

const navigationItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'employee'],
    },
    {
        title: 'Employees',
        href: '/dashboard/employees',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Departments',
        href: '/dashboard/departments',
        icon: Building2,
        roles: ['admin'],
    },
    {
        title: 'Leave Management',
        href: '/dashboard/leave',
        icon: Calendar,
        roles: ['admin', 'employee'],
    },
    {
        title: 'Payroll',
        href: '/dashboard/payroll',
        icon: DollarSign,
        roles: ['admin', 'employee'],
    },
    {
        title: 'Attendance',
        href: '/dashboard/attendance',
        icon: Clock,
        roles: ['admin', 'employee'],
    },
    {
        title: 'Performance',
        href: '/dashboard/performance',
        icon: BarChart3,
        roles: ['admin', 'employee'],
    },
    {
        title: 'My Profile',
        href: '/dashboard/profile',
        icon: User,
        roles: ['employee'],
    },
    {
        title: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
        roles: ['admin'],
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        roles: ['admin'],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const filteredItems = navigationItems.filter(item =>
        !item.roles || item.roles.includes(user?.role as 'admin' | 'employee')
    );

    return (
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">HRMS</h1>
                        <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className={cn(
                                'h-5 w-5',
                                isActive ? 'text-blue-700' : 'text-gray-400'
                            )} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
