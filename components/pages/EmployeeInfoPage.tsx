
import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../../services/db';
import { Employee } from '../../types';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';
import EmployeeFormModal from '../modals/EmployeeFormModal';

const EmployeeInfoPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = () => {
        setEmployees(getEmployees());
    };

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };
    
    const handleSave = () => {
        loadEmployees();
        setIsModalOpen(false);
    };
    
    const coloredText = (text: string) => <span style={{ color: COLORS.secondary }}>{text}</span>;
    const defaultText = (text: string) => <span style={{ color: COLORS.black }}>{text}</span>;

    return (
        <div className="p-4 relative min-h-screen">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.primary }}>Employees Information</h1>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs uppercase" style={{ backgroundColor: COLORS.secondary, color: COLORS.white }}>
                        <tr>
                            <th scope="col" className="px-6 py-3">SL No.</th>
                            <th scope="col" className="px-6 py-3">ID Number</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Designation</th>
                            <th scope="col" className="px-6 py-3">Line</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{defaultText((index + 1).toString())}</td>
                                <td className="px-6 py-4 font-medium">{coloredText(employee.id)}</td>
                                <td className="px-6 py-4">{defaultText(employee.name)}</td>
                                <td className="px-6 py-4">{coloredText(employee.designation)}</td>
                                <td className="px-6 py-4">{defaultText(employee.lineNumber)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(employee)} className="font-medium text-blue-600 hover:underline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={handleAdd}
                className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110"
                style={{ backgroundColor: COLORS.primary }}
                aria-label="Add new employee"
            >
                <Icon name="add" className="text-3xl" />
            </button>

            {isModalOpen && (
                <EmployeeFormModal
                    employee={selectedEmployee}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default EmployeeInfoPage;
