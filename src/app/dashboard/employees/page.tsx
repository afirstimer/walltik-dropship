'use client';

import { useState } from 'react';
import { useHRMS } from '@/contexts/HRMSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/types';

export default function EmployeesPage() {
    const { employees, departments, addEmployee, updateEmployee, deleteEmployee } = useHRMS();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const filteredEmployees = employees.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEmployee = (formData: FormData) => {
        const newEmployee = {
            userId: Date.now().toString(),
            employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            position: formData.get('position') as string,
            department: formData.get('department') as string,
            salary: Number(formData.get('salary')),
            hireDate: new Date(formData.get('hireDate') as string),
            status: 'active' as const,
            manager: formData.get('manager') as string,
            address: {
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zipCode: formData.get('zipCode') as string,
                country: formData.get('country') as string,
            },
            emergencyContact: {
                name: formData.get('emergencyName') as string,
                relationship: formData.get('emergencyRelationship') as string,
                phone: formData.get('emergencyPhone') as string,
            },
        };

        addEmployee(newEmployee);
        setIsAddDialogOpen(false);
        toast.success('Employee added successfully');
    };

    const handleUpdateEmployee = (formData: FormData) => {
        if (!selectedEmployee) return;

        const updates = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            position: formData.get('position') as string,
            department: formData.get('department') as string,
            salary: Number(formData.get('salary')),
            status: formData.get('status') as 'active' | 'inactive' | 'terminated',
            manager: formData.get('manager') as string,
        };

        updateEmployee(selectedEmployee.id, updates);
        setIsEditDialogOpen(false);
        setSelectedEmployee(null);
        toast.success('Employee updated successfully');
    };

    const handleDeleteEmployee = (employee: Employee) => {
        if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            deleteEmployee(employee.id);
            toast.success('Employee deleted successfully');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                    <p className="text-gray-600">Manage your team members and their information</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>Enter the employee information below.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddEmployee(new FormData(e.currentTarget));
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="position">Position</Label>
                                    <Input id="position" name="position" required />
                                </div>
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Select name="department" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input id="salary" name="salary" type="number" required />
                                </div>
                                <div>
                                    <Label htmlFor="hireDate">Hire Date</Label>
                                    <Input id="hireDate" name="hireDate" type="date" required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="manager">Manager</Label>
                                <Input id="manager" name="manager" />
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input name="street" placeholder="Street" required />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="city" placeholder="City" required />
                                    <Input name="state" placeholder="State" required />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="zipCode" placeholder="Zip Code" required />
                                    <Input name="country" placeholder="Country" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Emergency Contact</Label>
                                <Input name="emergencyName" placeholder="Name" required />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="emergencyRelationship" placeholder="Relationship" required />
                                    <Input name="emergencyPhone" placeholder="Phone" required />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Employee</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {employees.filter(emp => emp.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {employees.filter(emp => emp.status === 'inactive').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departments.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>All Employees</CardTitle>
                    <CardDescription>View and manage all employees</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Hire Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={employee.avatar} />
                                                <AvatarFallback>
                                                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                                                <div className="text-sm text-gray-500">{employee.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                employee.status === 'active' ? 'default' :
                                                    employee.status === 'inactive' ? 'secondary' : 'destructive'
                                            }
                                        >
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setIsViewDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteEmployee(employee)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Employee Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedEmployee.avatar} />
                                    <AvatarFallback className="text-lg">
                                        {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                                    </h3>
                                    <p className="text-gray-600">{selectedEmployee.position}</p>
                                    <Badge>{selectedEmployee.status}</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4" />
                                            <span>{selectedEmployee.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4" />
                                            <span>{selectedEmployee.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Work Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>Employee ID: {selectedEmployee.employeeId}</div>
                                        <div>Department: {selectedEmployee.department}</div>
                                        <div>Manager: {selectedEmployee.manager}</div>
                                        <div>Hire Date: {new Date(selectedEmployee.hireDate).toLocaleDateString()}</div>
                                        <div>Salary: ${selectedEmployee.salary.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Address</h4>
                                <div className="text-sm text-gray-600">
                                    {selectedEmployee.address.street}<br />
                                    {selectedEmployee.address.city}, {selectedEmployee.address.state} {selectedEmployee.address.zipCode}<br />
                                    {selectedEmployee.address.country}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Emergency Contact</h4>
                                <div className="text-sm text-gray-600">
                                    {selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship})<br />
                                    {selectedEmployee.emergencyContact.phone}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateEmployee(new FormData(e.currentTarget));
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-firstName">First Name</Label>
                                    <Input
                                        id="edit-firstName"
                                        name="firstName"
                                        defaultValue={selectedEmployee.firstName}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-lastName">Last Name</Label>
                                    <Input
                                        id="edit-lastName"
                                        name="lastName"
                                        defaultValue={selectedEmployee.lastName}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    defaultValue={selectedEmployee.email}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                    id="edit-phone"
                                    name="phone"
                                    defaultValue={selectedEmployee.phone}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-position">Position</Label>
                                    <Input
                                        id="edit-position"
                                        name="position"
                                        defaultValue={selectedEmployee.position}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Select name="department" defaultValue={selectedEmployee.department}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-salary">Salary</Label>
                                    <Input
                                        id="edit-salary"
                                        name="salary"
                                        type="number"
                                        defaultValue={selectedEmployee.salary}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select name="status" defaultValue={selectedEmployee.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="terminated">Terminated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit-manager">Manager</Label>
                                <Input
                                    id="edit-manager"
                                    name="manager"
                                    defaultValue={selectedEmployee.manager || ''}
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Employee</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
