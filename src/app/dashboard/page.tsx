'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useHRMS } from '@/contexts/HRMSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
    const { user, isAdmin, isEmployee } = useAuth();
    const { getAdminDashboardStats, getEmployeeDashboardStats, employees, leaveRequests } = useHRMS();

    if (isAdmin) {
        const stats = getAdminDashboardStats();
        const recentLeaveRequests = leaveRequests.slice(0, 5);
        const recentEmployees = employees.slice(-3);

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your organization</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeEmployees} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingLeaveRequests}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Departments</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.departmentCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Active departments
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
                            <p className="text-xs text-muted-foreground">
                                Performance score
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Leave Requests</CardTitle>
                            <CardDescription>Latest leave requests from employees</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentLeaveRequests.map((request) => {
                                    const employee = employees.find(emp => emp.id === request.employeeId);
                                    return (
                                        <div key={request.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                                                <p className="text-sm text-gray-600 capitalize">{request.type} leave</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        request.status === 'pending' ? 'secondary' :
                                                            request.status === 'approved' ? 'default' : 'destructive'
                                                    }
                                                >
                                                    {request.status}
                                                </Badge>
                                                <p className="text-sm text-gray-600">{request.days} days</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Employees</CardTitle>
                            <CardDescription>Newly added team members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentEmployees.map((employee) => (
                                    <div key={employee.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                                            <p className="text-sm text-gray-600">{employee.position}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline">{employee.department}</Badge>
                                            <p className="text-sm text-gray-600">
                                                {new Date(employee.hireDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isEmployee) {
        const employeeData = employees.find(emp => emp.userId === user?.id);
        const stats = getEmployeeDashboardStats(employeeData?.id || '');
        const myLeaveRequests = leaveRequests.filter(req => req.employeeId === employeeData?.id).slice(0, 3);

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600">Your personal workspace</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vacation Days</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.leaveBalance.vacation}</div>
                            <p className="text-xs text-muted-foreground">
                                Days remaining
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.leaveBalance.sick}</div>
                            <p className="text-xs text-muted-foreground">
                                Days remaining
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.attendanceThisMonth.present}</div>
                            <p className="text-xs text-muted-foreground">
                                Days this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last Payslip</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${stats.lastPayslip?.netPay.toLocaleString() || '0'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Net pay
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks you might need</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Request Leave
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Clock className="mr-2 h-4 w-4" />
                                Clock In/Out
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <DollarSign className="mr-2 h-4 w-4" />
                                View Payslips
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Leave Requests</CardTitle>
                            <CardDescription>Recent leave request status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {myLeaveRequests.length > 0 ? myLeaveRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium capitalize">{request.type} Leave</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant={
                                                    request.status === 'pending' ? 'secondary' :
                                                        request.status === 'approved' ? 'default' : 'destructive'
                                                }
                                            >
                                                {request.status}
                                            </Badge>
                                            <p className="text-sm text-gray-600">{request.days} days</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500">No leave requests yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
}
