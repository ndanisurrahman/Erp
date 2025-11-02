
import React, { useState, useEffect } from 'react';
import { getOutputs } from '../../services/db';
import { OutputData } from '../../types';
import { COLORS } from '../../constants';
import Icon from '../layout/Icon';
import OutputFormModal from '../modals/OutputFormModal';

const OutputPage: React.FC = () => {
    const [outputs, setOutputs] = useState<OutputData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOutput, setSelectedOutput] = useState<OutputData | null>(null);

    useEffect(() => {
        loadOutputs();
    }, []);

    const loadOutputs = () => {
        setOutputs(getOutputs());
    };

    const handleAdd = () => {
        setSelectedOutput(null);
        setIsModalOpen(true);
    };

    const handleEdit = (output: OutputData) => {
        setSelectedOutput(output);
        setIsModalOpen(true);
    };
    
    const handleSave = () => {
        loadOutputs();
        setIsModalOpen(false);
    };

    const coloredText = (text: string | number) => <span style={{ color: COLORS.secondary }}>{text}</span>;
    const defaultText = (text: string | number) => <span style={{ color: COLORS.black }}>{text}</span>;
    const successText = (text: string | number) => <span className="font-bold" style={{ color: COLORS.success }}>{text}</span>;
    const warningText = (text: string | number) => <span className="font-bold" style={{ color: COLORS.warning }}>{text}</span>;


    return (
        <div className="p-4 relative min-h-screen">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.primary }}>Output Data</h1>
            
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
                            <th scope="col" className="px-6 py-3">Total Output</th>
                            <th scope="col" className="px-6 py-3">Total Balance</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outputs.map((output, index) => (
                            <tr key={output.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{defaultText(index + 1)}</td>
                                <td className="px-6 py-4">{coloredText(output.date)}</td>
                                <td className="px-6 py-4 font-medium">{defaultText(output.buyer)}</td>
                                <td className="px-6 py-4">{coloredText(output.pf)}</td>
                                <td className="px-6 py-4">{defaultText(output.color)}</td>
                                <td className="px-6 py-4">{coloredText(output.po)}</td>
                                <td className="px-6 py-4">{successText(output.totalOutputQuantity)}</td>
                                <td className="px-6 py-4">{warningText(output.totalBalanceQuantity)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(output)} className="font-medium text-blue-600 hover:underline">
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
                aria-label="Add new output"
            >
                <Icon name="add" className="text-3xl" />
            </button>

            {isModalOpen && (
                <OutputFormModal
                    outputData={selectedOutput}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default OutputPage;
