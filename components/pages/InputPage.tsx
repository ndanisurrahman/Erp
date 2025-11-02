
import React, { useState, useEffect } from 'react';
import { getInputs } from '../../services/db';
import { InputData } from '../../types';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';
import InputFormModal from '../modals/InputFormModal';

const InputPage: React.FC = () => {
    const [inputs, setInputs] = useState<InputData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInput, setSelectedInput] = useState<InputData | null>(null);

    useEffect(() => {
        loadInputs();
    }, []);

    const loadInputs = () => {
        setInputs(getInputs());
    };

    const handleAdd = () => {
        setSelectedInput(null);
        setIsModalOpen(true);
    };

    const handleEdit = (input: InputData) => {
        setSelectedInput(input);
        setIsModalOpen(true);
    };
    
    const handleSave = () => {
        loadInputs();
        setIsModalOpen(false);
    };

    const coloredText = (text: string | number) => <span style={{ color: COLORS.secondary }}>{text}</span>;
    const defaultText = (text: string | number) => <span style={{ color: COLORS.black }}>{text}</span>;
    const successText = (text: string | number) => <span className="font-bold" style={{ color: COLORS.success }}>{text}</span>;

    return (
        <div className="p-4 relative min-h-screen">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.primary }}>Input Data</h1>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs uppercase" style={{ backgroundColor: COLORS.secondary, color: COLORS.white }}>
                        <tr>
                            <th scope="col" className="px-6 py-3">SL No.</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Buyer</th>
                            <th scope="col" className="px-6 py-3">PF</th>
                            <th scope="col" className="px-6 py-3">Color</th>
                            <th scope="col" className="px-6 py-3">PO</th>
                            <th scope="col" className="px-6 py-3">Total Input</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inputs.map((input, index) => (
                            <tr key={input.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{defaultText(index + 1)}</td>
                                <td className="px-6 py-4">{coloredText(input.date)}</td>
                                <td className="px-6 py-4 font-medium">{defaultText(input.buyer)}</td>
                                <td className="px-6 py-4">{coloredText(input.pf)}</td>
                                <td className="px-6 py-4">{defaultText(input.color)}</td>
                                <td className="px-6 py-4">{coloredText(input.po)}</td>
                                <td className="px-6 py-4">{successText(input.totalQuantity)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(input)} className="font-medium text-blue-600 hover:underline">
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
                aria-label="Add new input"
            >
                <Icon name="add" className="text-3xl" />
            </button>

            {isModalOpen && (
                <InputFormModal
                    inputData={selectedInput}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default InputPage;
