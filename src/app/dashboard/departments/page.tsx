'use client';

import { useState } from 'react';
import { useHRMS } from '@/contexts/HRMSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Department } from '@/types';

export default function DepartmentsPage() {
    const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useHRMS();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDepartmentEmployees = (departmentName: string) => {
        return employees.filter(emp => emp.department === departmentName);
    };

    const handleAddDepartment = (formData: FormData) => {
        const newDepartment = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            managerId: formData.get('managerId') as string,
            employeeCount: 0,
        };

        addDepartment(newDepartment);
        setIsAddDialogOpen(false);
        toast.success('Department added successfully');
    };

    const handleUpdateDepartment = (formData: FormData) => {
        if (!selectedDepartment) return;

        const updates = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            managerId: formData.get('managerId') as string,
        };

        updateDepartment(selectedDepartment.id, updates);
        setIsEditDialogOpen(false);
        setSelectedDepartment(null);
        toast.success('Department updated successfully');
    };

    const handleDeleteDepartment = (department: Department) => {
        const departmentEmployees = getDepartmentEmployees(department.name);
        if (departmentEmployees.length > 0) {
            toast.error('Cannot delete department with employees. Please reassign employees first.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${department.name}?`)) {
            deleteDepartment(department.id);
            toast.success('Department deleted successfully');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                    <p className="text-gray-600">Manage organizational departments and structure</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                            <DialogDescription>Create a new department in your organization.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddDepartment(new FormData(e.currentTarget));
                        }} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Department Name</Label>
                                <Input id="name" name="name" placeholder="e.g., Engineering" required />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Brief description of the department"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="managerId">Manager</Label>
                                <Input
                                    id="managerId"
                                    name="managerId"
                                    placeholder="Manager name or ID"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Department</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departments.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Largest Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.max(...departments.map(d => getDepartmentEmployees(d.name).length))}
                        </div>
                        <p className="text-xs text-muted-foreground">employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(employees.length / departments.length)}
                        </div>
                        <p className="text-xs text-muted-foreground">employees per dept</p>
                    </CardContent>
                </Card>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => {
                    const departmentEmployees = getDepartmentEmployees(department.name);
                    return (
                        <Card key={department.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{department.name}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {department.description}
                                        </CardDescription>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedDepartment(department);
                                                setIsEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteDepartment(department)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Manager</span>
                                        <Badge variant="outline">{department.managerId}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Employees</span>
                                        <Badge>{departmentEmployees.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Created</span>
                                        <span className="text-sm">
                                            {new Date(department.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {departmentEmployees.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2">Team Members</h4>
                                        <div className="space-y-1">
                                            {departmentEmployees.slice(0, 3).map((employee) => (
                                                <div key={employee.id} className="text-xs text-gray-600 flex justify-between">
                                                    <span>{employee.firstName} {employee.lastName}</span>
                                                    <span>{employee.position}</span>
                                                </div>
                                            ))}
                                            {departmentEmployees.length > 3 && (
                                                <div className="text-xs text-gray-500">
                                                    +{departmentEmployees.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detailed Table View */}
            <Card>
                <CardHeader>
                    <CardTitle>Department Overview</CardTitle>
                    <CardDescription>Detailed view of all departments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search departments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead>Employees</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDepartments.map((department) => {
                                const departmentEmployees = getDepartmentEmployees(department.name);
                                return (
                                    <TableRow key={department.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{department.name}</div>
                                                <div className="text-sm text-gray-500">{department.description}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{department.managerId}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{departmentEmployees.length}</Badge>
                                        </TableCell>
                                        <TableCell>{new Date(department.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedDepartment(department);
                                                        setIsEditDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteDepartment(department)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Department Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>Update department information.</DialogDescription>
                    </DialogHeader>
                    {selectedDepartment && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateDepartment(new FormData(e.currentTarget));
                        }} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Department Name</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    defaultValue={selectedDepartment.name}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    defaultValue={selectedDepartment.description}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-managerId">Manager</Label>
                                <Input
                                    id="edit-managerId"
                                    name="managerId"
                                    defaultValue={selectedDepartment.managerId}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Department</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
