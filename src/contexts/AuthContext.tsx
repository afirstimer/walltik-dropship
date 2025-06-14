'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<boolean>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isEmployee: boolean;
    loading: boolean;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@hrms.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'John',
        lastName: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        email: 'employee@hrms.com',
        password: 'emp123',
        role: 'employee',
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
    },
    {
        id: '3',
        email: 'mike@hrms.com',
        password: 'mike123',
        role: 'employee',
        firstName: 'Mike',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
    },
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem('hrms_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundUser = mockUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('hrms_user', JSON.stringify(foundUser));
            setLoading(false);
            return true;
        }

        setLoading(false);
        return false;
    };

    const register = async (userData: RegisterData): Promise<boolean> => {
        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
            setLoading(false);
            return false;
        }

        const newUser: User = {
            id: Date.now().toString(),
            ...userData,
            avatar: userData.role === 'admin'
                ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('hrms_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hrms_user');
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isEmployee = user?.role === 'employee';

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                isAuthenticated,
                isAdmin,
                isEmployee,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
