'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import {
    type Employee,
    type Department,
    type LeaveRequest,
    type PayrollRecord,
    type AdminDashboardStats,
    type EmployeeDashboardStats,
    type LeaveStatus,
} from '@/types';

interface HRMSContextType {
    // Employees
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    getEmployee: (id: string) => Employee | undefined;

    // Departments
    departments: Department[];
    addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateDepartment: (id: string, updates: Partial<Department>) => void;
    deleteDepartment: (id: string) => void;

    // Leave Requests
    leaveRequests: LeaveRequest[];
    submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
    approveLeaveRequest: (id: string, approverId: string) => void;
    rejectLeaveRequest: (id: string, approverId: string, reason: string) => void;

    // Payroll
    payrollRecords: PayrollRecord[];
    processPayroll: (employeeId: string, payrollData: Omit<PayrollRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;

    // Dashboard Stats
    getAdminDashboardStats: () => AdminDashboardStats;
    getEmployeeDashboardStats: (employeeId: string) => EmployeeDashboardStats;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

// Mock data
const mockDepartments: Department[] = [
    {
        id: '1',
        name: 'Engineering',
        description: 'Software development and technical operations',
        managerId: '2',
        employeeCount: 15,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Human Resources',
        description: 'Employee relations and organizational development',
        managerId: '3',
        employeeCount: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        name: 'Marketing',
        description: 'Brand promotion and customer acquisition',
        managerId: '4',
        employeeCount: 8,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '4',
        name: 'Finance',
        description: 'Financial planning and accounting',
        managerId: '5',
        employeeCount: 6,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
];

const mockEmployees: Employee[] = [
    {
        id: '1',
        userId: '2',
        employeeId: 'EMP001',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'employee@hrms.com',
        phone: '+1 (555) 123-4567',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        salary: 85000,
        hireDate: new Date('2023-03-15'),
        status: 'active',
        manager: 'John Admin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            country: 'USA',
        },
        emergencyContact: {
            name: 'John Smith',
            relationship: 'Spouse',
            phone: '+1 (555) 987-6543',
        },
        createdAt: new Date('2023-03-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        userId: '3',
        employeeId: 'EMP002',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@hrms.com',
        phone: '+1 (555) 234-5678',
        position: 'Frontend Developer',
        department: 'Engineering',
        salary: 72000,
        hireDate: new Date('2023-06-01'),
        status: 'active',
        manager: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        address: {
            street: '456 Oak Ave',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94103',
            country: 'USA',
        },
        emergencyContact: {
            name: 'Sarah Johnson',
            relationship: 'Sister',
            phone: '+1 (555) 876-5432',
        },
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2024-01-10'),
    },
    {
        id: '3',
        userId: '4',
        employeeId: 'EMP003',
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'sarah@hrms.com',
        phone: '+1 (555) 345-6789',
        position: 'Marketing Manager',
        department: 'Marketing',
        salary: 78000,
        hireDate: new Date('2022-11-20'),
        status: 'active',
        manager: 'John Admin',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        address: {
            street: '789 Pine St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94104',
            country: 'USA',
        },
        emergencyContact: {
            name: 'Tom Davis',
            relationship: 'Father',
            phone: '+1 (555) 765-4321',
        },
        createdAt: new Date('2022-11-20'),
        updatedAt: new Date('2024-01-05'),
    },
];

const mockLeaveRequests: LeaveRequest[] = [
    {
        id: '1',
        employeeId: '1',
        type: 'vacation',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-07-19'),
        days: 5,
        reason: 'Family vacation',
        status: 'pending',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-06-01'),
    },
    {
        id: '2',
        employeeId: '2',
        type: 'sick',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-12'),
        days: 3,
        reason: 'Medical appointment',
        status: 'approved',
        approvedBy: '1',
        approvedAt: new Date('2024-06-08'),
        createdAt: new Date('2024-06-05'),
        updatedAt: new Date('2024-06-08'),
    },
];

const mockPayrollRecords: PayrollRecord[] = [
    {
        id: '1',
        employeeId: '1',
        month: 5,
        year: 2024,
        baseSalary: 7083.33,
        allowances: 500,
        deductions: 200,
        overtime: 300,
        bonus: 1000,
        grossPay: 8683.33,
        netPay: 6546.50,
        taxDeductions: 2136.83,
        status: 'paid',
        payDate: new Date('2024-05-31'),
        createdAt: new Date('2024-05-25'),
        updatedAt: new Date('2024-05-31'),
    },
];

export function HRMSProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);

    const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newEmployee: Employee = {
            ...employeeData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setEmployees(prev => [...prev, newEmployee]);
    };

    const updateEmployee = (id: string, updates: Partial<Employee>) => {
        setEmployees(prev =>
            prev.map(emp =>
                emp.id === id ? { ...emp, ...updates, updatedAt: new Date() } : emp
            )
        );
    };

    const deleteEmployee = (id: string) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    const getEmployee = (id: string) => {
        return employees.find(emp => emp.id === id);
    };

    const addDepartment = (deptData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newDepartment: Department = {
            ...deptData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setDepartments(prev => [...prev, newDepartment]);
    };

    const updateDepartment = (id: string, updates: Partial<Department>) => {
        setDepartments(prev =>
            prev.map(dept =>
                dept.id === id ? { ...dept, ...updates, updatedAt: new Date() } : dept
            )
        );
    };

    const deleteDepartment = (id: string) => {
        setDepartments(prev => prev.filter(dept => dept.id !== id));
    };

    const submitLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newRequest: LeaveRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setLeaveRequests(prev => [...prev, newRequest]);
    };

    const approveLeaveRequest = (id: string, approverId: string) => {
        setLeaveRequests(prev =>
            prev.map(req =>
                req.id === id
                    ? {
                        ...req,
                        status: 'approved' as LeaveStatus,
                        approvedBy: approverId,
                        approvedAt: new Date(),
                        updatedAt: new Date(),
                    }
                    : req
            )
        );
    };

    const rejectLeaveRequest = (id: string, approverId: string, reason: string) => {
        setLeaveRequests(prev =>
            prev.map(req =>
                req.id === id
                    ? {
                        ...req,
                        status: 'rejected' as LeaveStatus,
                        approvedBy: approverId,
                        rejectionReason: reason,
                        updatedAt: new Date(),
                    }
                    : req
            )
        );
    };

    const processPayroll = (employeeId: string, payrollData: Omit<PayrollRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newPayroll: PayrollRecord = {
            ...payrollData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setPayrollRecords(prev => [...prev, newPayroll]);
    };

    const getAdminDashboardStats = (): AdminDashboardStats => {
        return {
            totalEmployees: employees.length,
            activeEmployees: employees.filter(emp => emp.status === 'active').length,
            pendingLeaveRequests: leaveRequests.filter(req => req.status === 'pending').length,
            pendingPayroll: payrollRecords.filter(pr => pr.status === 'pending').length,
            departmentCount: departments.length,
            averageRating: 4.2,
        };
    };

    const getEmployeeDashboardStats = (employeeId: string): EmployeeDashboardStats => {
        const employeeLeaves = leaveRequests.filter(req => req.employeeId === employeeId);

        return {
            leaveBalance: {
                vacation: 15 - employeeLeaves.filter(req => req.type === 'vacation' && req.status === 'approved').reduce((sum, req) => sum + req.days, 0),
                sick: 10 - employeeLeaves.filter(req => req.type === 'sick' && req.status === 'approved').reduce((sum, req) => sum + req.days, 0),
                personal: 5 - employeeLeaves.filter(req => req.type === 'personal' && req.status === 'approved').reduce((sum, req) => sum + req.days, 0),
            },
            attendanceThisMonth: {
                present: 20,
                absent: 2,
                late: 1,
            },
            pendingRequests: employeeLeaves.filter(req => req.status === 'pending').length,
            lastPayslip: payrollRecords.filter(pr => pr.employeeId === employeeId).sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0],
        };
    };

    return (
        <HRMSContext.Provider
            value={{
                employees,
                addEmployee,
                updateEmployee,
                deleteEmployee,
                getEmployee,
                departments,
                addDepartment,
                updateDepartment,
                deleteDepartment,
                leaveRequests,
                submitLeaveRequest,
                approveLeaveRequest,
                rejectLeaveRequest,
                payrollRecords,
                processPayroll,
                getAdminDashboardStats,
                getEmployeeDashboardStats,
            }}
        >
            {children}
        </HRMSContext.Provider>
    );
}

export function useHRMS() {
    const context = useContext(HRMSContext);
    if (context === undefined) {
        throw new Error('useHRMS must be used within an HRMSProvider');
    }
    return context;
}
