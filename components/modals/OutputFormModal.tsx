
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { OutputData, InputData } from '../../types';
import { saveOutput, deleteOutput, getInputs, getOutputs } from '../../services/db';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';

interface OutputFormModalProps {
    outputData: OutputData | null;
    onClose: () => void;
    onSave: () => void;
}

const defaultOutputData: OutputData = {
    id: '', date: '', lineNumber: '', buyer: '', po: '', style: '', pf: '', color: '', sewingFinishDate: '', 
    sizeShadeQty: [], totalOutputQuantity: 0, totalBalanceQuantity: 0
};

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold border-b-2 pb-2 mb-4" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const InputField: React.FC<{ label: string, value: string | number, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, type?: string, disabled?: boolean, children?: React.ReactNode }> = 
    ({ label, name, value, onChange, type='text', disabled=false, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        { type === 'select' ? (
            <select name={name} value={value} onChange={onChange} disabled={disabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100">{children}</select>
        ) : (
            <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100" />
        )}
    </div>
);


const OutputFormModal: React.FC<OutputFormModalProps> = ({ outputData, onClose, onSave }) => {
    const [formData, setFormData] = useState<OutputData>(defaultOutputData);
    const [allInputs, setAllInputs] = useState<InputData[]>([]);

    const uniqueInputFilters = useMemo(() => {
        const filters = {
            lineNumbers: [...new Set(allInputs.map(i => i.lineNumber))],
            buyers: [...new Set(allInputs.map(i => i.buyer))],
            pos: [...new Set(allInputs.map(i => i.po))],
            styles: [...new Set(allInputs.map(i => i.style))],
            pfs: [...new Set(allInputs.map(i => i.pf))],
            colors: [...new Set(allInputs.map(i => i.color))],
        };
        return filters;
    }, [allInputs]);

    useEffect(() => {
        setAllInputs(getInputs());
        const initialData = outputData ? { ...outputData } : { ...defaultOutputData, id: `OUT${Date.now()}`};
        setFormData(initialData);
    }, [outputData]);

    const updateQuantities = useCallback(() => {
        const totalOutput = formData.sizeShadeQty.reduce((sum, item) => sum + Number(item.outputQuantity || 0), 0);
        const totalBalance = formData.sizeShadeQty.reduce((sum, item) => sum + Number(item.balanceQuantity || 0), 0);
        setFormData(prev => ({ ...prev, totalOutputQuantity: totalOutput, totalBalanceQuantity: totalBalance }));
    }, [formData.sizeShadeQty]);

    useEffect(() => {
        updateQuantities();
    }, [formData.sizeShadeQty, updateQuantities]);

    const autoFillData = useCallback(() => {
        const { lineNumber, buyer, po, style, pf, color } = formData;
        if (lineNumber && buyer && po && style && pf && color) {
            const matchingInputs = allInputs.filter(i => 
                i.lineNumber === lineNumber && i.buyer === buyer && i.po === po && 
                i.style === style && i.pf === pf && i.color === color
            );

            if (matchingInputs.length > 0) {
                const allOutputs = getOutputs();
                const existingOutputsForThisEntry = allOutputs.filter(o => 
                    o.lineNumber === lineNumber && o.buyer === buyer && o.po === po && 
                    o.style === style && o.pf === pf && o.color === color && o.id !== formData.id
                );

                const aggregatedInputQty: { [key: string]: number } = {};
                matchingInputs.forEach(input => {
                    input.sizeShadeQty.forEach(ssq => {
                        const key = `${ssq.size}-${ssq.shade}`;
                        aggregatedInputQty[key] = (aggregatedInputQty[key] || 0) + ssq.quantity;
                    });
                });
                
                const existingOutputQty: { [key: string]: number } = {};
                 existingOutputsForThisEntry.forEach(output => {
                    output.sizeShadeQty.forEach(ssq => {
                        const key = `${ssq.size}-${ssq.shade}`;
                        existingOutputQty[key] = (existingOutputQty[key] || 0) + ssq.outputQuantity;
                    });
                });

                const newSizeShadeQty = Object.keys(aggregatedInputQty).map(key => {
                    const [size, shade] = key.split('-');
                    const inputQuantity = aggregatedInputQty[key];
                    const existingOutput = existingOutputQty[key] || 0;
                    
                    const currentOutputEntry = outputData?.sizeShadeQty.find(s => s.size === size && s.shade === shade);
                    const outputQuantity = currentOutputEntry ? currentOutputEntry.outputQuantity : 0;
                    
                    const balanceQuantity = inputQuantity - existingOutput - outputQuantity;
                    
                    return { size, shade, inputQuantity, outputQuantity, balanceQuantity };
                });

                setFormData(prev => ({ ...prev, sizeShadeQty: newSizeShadeQty, sewingFinishDate: matchingInputs[0].sewingFinishDate }));
            }
        }
    }, [formData, allInputs, outputData]);
    
    useEffect(() => {
        if (!outputData) { // Only auto-fill for new entries
           autoFillData();
        }
    }, [formData.lineNumber, formData.buyer, formData.po, formData.style, formData.pf, formData.color, outputData, autoFillData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOutputQtyChange = (index: number, value: string) => {
        const newQty = Number(value) || 0;
        const newSizeShadeQty = [...formData.sizeShadeQty];
        const item = newSizeShadeQty[index];

        const allOutputs = getOutputs();
        const otherOutputsForThisEntry = allOutputs.filter(o => 
             o.lineNumber === formData.lineNumber && o.buyer === formData.buyer && o.po === formData.po && 
             o.style === formData.style && o.pf === formData.pf && o.color === formData.color && o.id !== formData.id
        );

        let previouslyOutputted = 0;
        otherOutputsForThisEntry.forEach(output => {
            const match = output.sizeShadeQty.find(s => s.size === item.size && s.shade === item.shade);
            if (match) previouslyOutputted += match.outputQuantity;
        });
        
        item.outputQuantity = newQty;
        item.balanceQuantity = item.inputQuantity - previouslyOutputted - newQty;
        setFormData(prev => ({ ...prev, sizeShadeQty: newSizeShadeQty }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveOutput(formData);
        onSave();
    };
    
    const handleDelete = () => {
        if (outputData && window.confirm('Are you sure you want to delete this output record?')) {
            deleteOutput(outputData.id);
            onSave();
        }
    };
    
    const handleNew = () => {
        setFormData({ ...defaultOutputData, id: `OUT${Date.now()}` });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]">
                <div className="flex-shrink-0 p-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    <button onClick={onClose} className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-md transition-colors">
                        <Icon name="arrow_back" />
                        <span className="text-lg font-semibold">{outputData ? 'View Output Details' : 'Add New Output'}</span>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit}>
                        <FormSection title="Main Information">
                            <InputField label="Output Date" name="date" value={formData.date} onChange={handleChange} type="date" />
                             <InputField label="Line Number" name="lineNumber" value={formData.lineNumber} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select Line</option>
                                {uniqueInputFilters.lineNumbers.map(l => <option key={l} value={l}>{l}</option>)}
                            </InputField>
                            <InputField label="Buyer" name="buyer" value={formData.buyer} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select Buyer</option>
                                {uniqueInputFilters.buyers.map(b => <option key={b} value={b}>{b}</option>)}
                            </InputField>
                            <InputField label="PO" name="po" value={formData.po} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select PO</option>
                                {uniqueInputFilters.pos.map(p => <option key={p} value={p}>{p}</option>)}
                            </InputField>
                            <InputField label="Style" name="style" value={formData.style} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select Style</option>
                                {uniqueInputFilters.styles.map(s => <option key={s} value={s}>{s}</option>)}
                            </InputField>
                             <InputField label="PF" name="pf" value={formData.pf} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select PF</option>
                                {uniqueInputFilters.pfs.map(p => <option key={p} value={p}>{p}</option>)}
                            </InputField>
                            <InputField label="Color" name="color" value={formData.color} onChange={handleChange} type="select" disabled={!!outputData}>
                                <option value="">Select Color</option>
                                {uniqueInputFilters.colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </InputField>
                            <InputField label="Sewing Finished Date" name="sewingFinishDate" value={formData.sewingFinishDate} onChange={handleChange} type="date" disabled />
                        </FormSection>

                         <div className="mb-6">
                            <h3 className="text-lg font-semibold border-b-2 pb-2 mb-4" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
                                Size, Shade, and Quality
                            </h3>
                             <div className="overflow-x-auto">
                                 <table className="w-full text-sm">
                                     <thead>
                                        <tr className="text-left font-semibold">
                                            <th className="p-2">Size</th>
                                            <th className="p-2">Shade</th>
                                            <th className="p-2">Input Qty</th>
                                            <th className="p-2">Output Qty</th>
                                            <th className="p-2">Balance Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.sizeShadeQty.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{item.size}</td>
                                                <td className="p-2">{item.shade}</td>
                                                <td className="p-2">{item.inputQuantity}</td>
                                                <td className="p-2">
                                                    <input type="number" value={item.outputQuantity} onChange={(e) => handleOutputQtyChange(index, e.target.value)} className="w-24 p-1 border rounded-md"/>
                                                </td>
                                                <td className="p-2">{item.balanceQuantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                 </table>
                            </div>
                        </div>

                         <div className="mt-6 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4" style={{backgroundColor: COLORS.lightGrey}}>
                            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                                Total Output: <span style={{ color: COLORS.success }}>{formData.totalOutputQuantity}</span>
                            </h3>
                            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                                Total Balance: <span style={{ color: COLORS.warning }}>{formData.totalBalanceQuantity}</span>
                            </h3>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 p-4 border-t flex justify-end gap-4 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={handleNew} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">New</button>
                    {outputData && <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>}
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                </div>
            </div>
        </div>
    );
};

export default OutputFormModal;
