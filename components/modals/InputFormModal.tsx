
import React, { useState, useEffect, useMemo } from 'react';
import { InputData, InputSizeShade } from '../../types';
import { saveInput, deleteInput } from '../../services/db';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';

interface InputFormModalProps {
    inputData: InputData | null;
    onClose: () => void;
    onSave: () => void;
}

const defaultInputData: InputData = {
    id: '', date: '', lineNumber: '', buyer: '', po: '', style: '', pf: '', color: '', sewingFinishDate: '', 
    sizeShadeQty: [{ size: '', shade: '', quantity: 0 }], totalQuantity: 0
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

const InputField: React.FC<{ label: string, value: string | number, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }> = 
    ({ label, name, value, onChange, type='text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const InputFormModal: React.FC<InputFormModalProps> = ({ inputData, onClose, onSave }) => {
    const [formData, setFormData] = useState<InputData>(defaultInputData);

    const totalQuantity = useMemo(() => {
        return formData.sizeShadeQty.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    }, [formData.sizeShadeQty]);


    useEffect(() => {
        const initialData = inputData ? { ...inputData } : { ...defaultInputData, id: `INP${Date.now()}`};
        setFormData(initialData);
    }, [inputData]);
    
    useEffect(() => {
        setFormData(prev => ({ ...prev, totalQuantity }));
    }, [totalQuantity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeShadeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newSizeShadeQty = [...formData.sizeShadeQty];
        newSizeShadeQty[index] = { ...newSizeShadeQty[index], [name]: name === 'quantity' ? Number(value) : value };
        setFormData(prev => ({ ...prev, sizeShadeQty: newSizeShadeQty }));
    };

    const addSizeShade = () => {
        setFormData(prev => ({ ...prev, sizeShadeQty: [...prev.sizeShadeQty, { size: '', shade: '', quantity: 0 }] }));
    };

    const removeSizeShade = (index: number) => {
        if (formData.sizeShadeQty.length > 1) {
            const newSizeShadeQty = formData.sizeShadeQty.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, sizeShadeQty: newSizeShadeQty }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveInput(formData);
        onSave();
    };
    
    const handleDelete = () => {
        if (inputData && window.confirm('Are you sure you want to delete this input record?')) {
            deleteInput(inputData.id);
            onSave();
        }
    };

    const handleNew = () => {
        setFormData({ ...defaultInputData, id: `INP${Date.now()}` });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <div className="flex-shrink-0 p-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    <button onClick={onClose} className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-md transition-colors">
                        <Icon name="arrow_back" />
                        <span className="text-lg font-semibold">{inputData ? 'View Input Details' : 'Add New Input'}</span>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                    <FormSection title="Main Information">
                        <InputField label="Input Date" name="date" value={formData.date} onChange={handleChange} type="date" />
                        <InputField label="Line Number" name="lineNumber" value={formData.lineNumber} onChange={handleChange} />
                        <InputField label="Buyer" name="buyer" value={formData.buyer} onChange={handleChange} />
                        <InputField label="PO" name="po" value={formData.po} onChange={handleChange} />
                        <InputField label="Style" name="style" value={formData.style} onChange={handleChange} />
                        <InputField label="PF" name="pf" value={formData.pf} onChange={handleChange} />
                        <InputField label="Color" name="color" value={formData.color} onChange={handleChange} />
                        <InputField label="Sewing Finished Date" name="sewingFinishDate" value={formData.sewingFinishDate} onChange={handleChange} type="date" />
                    </FormSection>

                    <FormSection title="Size, Shade, and Quantity">
                        {formData.sizeShadeQty.map((item, index) => (
                             <div key={index} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <InputField label={`Size #${index + 1}`} name="size" value={item.size} onChange={(e) => handleSizeShadeChange(index, e)} />
                                <InputField label={`Shade #${index + 1}`} name="shade" value={item.shade} onChange={(e) => handleSizeShadeChange(index, e)} />
                                <InputField label={`Quantity #${index + 1}`} name="quantity" value={item.quantity} onChange={(e) => handleSizeShadeChange(index, e)} type="number" />
                                <div className="flex gap-2">
                                     <button type="button" onClick={addSizeShade} className="p-2 bg-green-500 text-white rounded-md"><Icon name="add" /></button>
                                     <button type="button" onClick={() => removeSizeShade(index)} className="p-2 bg-red-500 text-white rounded-md"><Icon name="remove" /></button>
                                </div>
                            </div>
                        ))}
                    </FormSection>
                    
                    <div className="mt-6 p-4 rounded-md" style={{backgroundColor: COLORS.lightGrey}}>
                        <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                            Total Quantity: <span style={{ color: COLORS.success }}>{formData.totalQuantity}</span>
                        </h3>
                    </div>
                </form>

                <div className="flex-shrink-0 p-4 border-t flex justify-end gap-4 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={handleNew} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">New</button>
                    {inputData && <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>}
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                </div>
            </div>
        </div>
    );
};

export default InputFormModal;
