
import React, { useState, useEffect, useCallback } from 'react';
import { Employee, EmployeeSkill } from '../../types';
import { saveEmployee, deleteEmployee } from '../../services/db';
import { COLORS, BANGLADESH_DIVISIONS, BLOOD_GROUPS } from '../../constants';
import Icon from '../layout/Icon';

interface EmployeeFormModalProps {
    employee: Employee | null;
    onClose: () => void;
    onSave: () => void;
}

const defaultEmployee: Employee = {
    id: '', name: '', designation: '', lineNumber: '', joinDate: '', phone: '', skills: [{ item: '', process: '' }],
    nid: '', fatherName: '', motherName: '', isMarried: false, gender: 'Male', bloodGroup: '', division: '',
    district: '', upazila: '', thana: '', postOffice: '', village: '', photo: ''
};

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold border-b-2 pb-2 mb-4" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const InputField: React.FC<{ label: string, value: string | number, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, type?: string }> = 
    ({ label, name, value, onChange, required=false, type='text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}{required && '*'}</label>
        <input type={type} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);


const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState<Employee>(defaultEmployee);

    useEffect(() => {
        setFormData(employee ? { ...employee } : { ...defaultEmployee, id: `EMP${Date.now()}` });
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({...prev, [name]: checked}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSkillChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newSkills = [...formData.skills];
        newSkills[index] = { ...newSkills[index], [name]: value };
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, { item: '', process: '' }] }));
    };

    const removeSkill = (index: number) => {
        if (formData.skills.length > 1) {
            const newSkills = formData.skills.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, skills: newSkills }));
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveEmployee(formData);
        onSave();
    };
    
    const handleDelete = () => {
        if (employee && window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(employee.id);
            onSave();
        }
    };
    
    const handleNew = () => {
        setFormData({ ...defaultEmployee, id: `EMP${Date.now()}` });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    <button onClick={onClose} className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-md transition-colors">
                        <Icon name="arrow_back" />
                        <span className="text-lg font-semibold">{employee ? 'View Details' : 'Add New Employee'}</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                    <FormSection title="Basic Information">
                         <InputField label="ID Number" name="id" value={formData.id} onChange={handleChange} required disabled />
                        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                        <InputField label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
                        <InputField label="Line Number" name="lineNumber" value={formData.lineNumber} onChange={handleChange} />
                        <InputField label="Join Date" name="joinDate" value={formData.joinDate} onChange={handleChange} type="date"/>
                        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                    </FormSection>

                    <FormSection title="Skills">
                        {formData.skills.map((skill, index) => (
                             <div key={index} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <InputField label={`Item #${index + 1}`} name="item" value={skill.item} onChange={(e) => handleSkillChange(index, e as any)} />
                                <InputField label={`Process #${index + 1}`} name="process" value={skill.process} onChange={(e) => handleSkillChange(index, e as any)} />
                                <div className="flex gap-2">
                                     <button type="button" onClick={addSkill} className="p-2 bg-green-500 text-white rounded-md"><Icon name="add" /></button>
                                     <button type="button" onClick={() => removeSkill(index)} className="p-2 bg-red-500 text-white rounded-md"><Icon name="remove" /></button>
                                </div>
                            </div>
                        ))}
                    </FormSection>
                    
                    <FormSection title="Personal Information">
                        <InputField label="NID/Birth Certificate" name="nid" value={formData.nid} onChange={handleChange} />
                        <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                        <InputField label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">Select...</option>
                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" id="isMarried" name="isMarried" checked={formData.isMarried} onChange={handleChange} className="h-4 w-4 rounded" />
                            <label htmlFor="isMarried" className="text-sm font-medium text-gray-700">Married/Unmarried</label>
                        </div>
                    </FormSection>

                     <FormSection title="Address">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Division</label>
                             <select name="division" value={formData.division} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                 <option value="">Select Division</option>
                                 {BANGLADESH_DIVISIONS.map(div => <option key={div} value={div}>{div}</option>)}
                             </select>
                        </div>
                        <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
                        <InputField label="Upazila" name="upazila" value={formData.upazila} onChange={handleChange} />
                        <InputField label="Thana" name="thana" value={formData.thana} onChange={handleChange} />
                        <InputField label="Post Office" name="postOffice" value={formData.postOffice} onChange={handleChange} />
                        <InputField label="Village/Road" name="village" value={formData.village} onChange={handleChange} />
                    </FormSection>

                    <FormSection title="Photo Upload">
                         <div className="col-span-1 md:col-span-2">
                             <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                             {formData.photo && <img src={formData.photo} alt="Preview" className="mt-4 w-[150px] h-[150px] object-cover rounded-md shadow-md"/>}
                        </div>
                    </FormSection>
                </form>

                 {/* Fixed Footer */}
                <div className="flex-shrink-0 p-4 border-t flex justify-end gap-4 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={handleNew} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">New</button>
                    {employee && <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>}
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeFormModal;
