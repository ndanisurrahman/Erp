
import { Employee, InputData, OutputData } from '../types';

const EMPLOYEES_KEY = 'pacific_attires_employees';
const INPUTS_KEY = 'pacific_attires_inputs';
const OUTPUTS_KEY = 'pacific_attires_outputs';

const getFromStorage = <T,>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return [];
    }
};

const saveToStorage = <T,>(key: string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

// --- Mock Data Initialization ---
const initializeMockData = () => {
    if (!localStorage.getItem(EMPLOYEES_KEY)) {
        const mockEmployees: Employee[] = [
            { id: 'EMP001', name: 'John Doe', designation: 'Sewing Operator', lineNumber: '5', joinDate: '2023-01-15', phone: '01234567890', skills: [{ item: 'T-Shirt', process: 'Neck Join' }], nid: '1234567890', fatherName: 'Richard Doe', motherName: 'Jane Doe', isMarried: true, gender: 'Male', bloodGroup: 'O+', division: 'Dhaka', district: 'Dhaka', upazila: 'Savar', thana: 'Savar', postOffice: 'Savar Cantt', village: 'Hemayetpur', photo: '' },
            { id: 'EMP002', name: 'Jane Smith', designation: 'Quality Inspector', lineNumber: '3', joinDate: '2022-11-20', phone: '09876543210', skills: [{ item: 'Polo Shirt', process: 'Button Attach' }], nid: '0987654321', fatherName: 'John Smith', motherName: 'Mary Smith', isMarried: false, gender: 'Female', bloodGroup: 'A+', division: 'Chattogram', district: 'Chattogram', upazila: 'Pahartali', thana: 'Pahartali', postOffice: 'CDA Market', village: 'AK Khan', photo: '' },
        ];
        saveToStorage(EMPLOYEES_KEY, mockEmployees);
    }

    if (!localStorage.getItem(INPUTS_KEY)) {
        const mockInputs: InputData[] = [
           { id: 'INP001', date: '2024-07-20', lineNumber: '5', buyer: 'H&M', po: 'PO123', style: 'Basic Tee', pf: 'PF001', color: 'Black', sewingFinishDate: '2024-07-30', sizeShadeQty: [{size: 'M', shade: 'A', quantity: 500}, {size: 'L', shade: 'A', quantity: 700}], totalQuantity: 1200 },
           { id: 'INP002', date: '2024-07-21', lineNumber: '3', buyer: 'Zara', po: 'PO456', style: 'Polo', pf: 'PF002', color: 'White', sewingFinishDate: '2024-08-05', sizeShadeQty: [{size: 'S', shade: 'B', quantity: 300}, {size: 'M', shade: 'B', quantity: 400}], totalQuantity: 700 },
        ];
        saveToStorage(INPUTS_KEY, mockInputs);
    }
    
    if (!localStorage.getItem(OUTPUTS_KEY)) {
        const mockOutputs: OutputData[] = [];
        saveToStorage(OUTPUTS_KEY, mockOutputs);
    }
};

initializeMockData();

// --- Employee Service ---
export const getEmployees = (): Employee[] => getFromStorage<Employee>(EMPLOYEES_KEY);
export const saveEmployee = (employee: Employee): void => {
    const employees = getEmployees();
    const index = employees.findIndex(e => e.id === employee.id);
    if (index > -1) {
        employees[index] = employee;
    } else {
        employees.push(employee);
    }
    saveToStorage(EMPLOYEES_KEY, employees);
};
export const deleteEmployee = (employeeId: string): void => {
    let employees = getEmployees();
    employees = employees.filter(e => e.id !== employeeId);
    saveToStorage(EMPLOYEES_KEY, employees);
}

// --- Input Service ---
export const getInputs = (): InputData[] => getFromStorage<InputData>(INPUTS_KEY);
export const saveInput = (input: InputData): void => {
    const inputs = getInputs();
    const index = inputs.findIndex(i => i.id === input.id);
    if (index > -1) {
        inputs[index] = input;
    } else {
        inputs.push(input);
    }
    saveToStorage(INPUTS_KEY, inputs);
};
export const deleteInput = (inputId: string): void => {
    let inputs = getInputs();
    inputs = inputs.filter(i => i.id !== inputId);
    saveToStorage(INPUTS_KEY, inputs);
}


// --- Output Service ---
export const getOutputs = (): OutputData[] => getFromStorage<OutputData>(OUTPUTS_KEY);
export const saveOutput = (output: OutputData): void => {
    const outputs = getOutputs();
    const index = outputs.findIndex(o => o.id === output.id);
    if (index > -1) {
        outputs[index] = output;
    } else {
        outputs.push(output);
    }
    saveToStorage(OUTPUTS_KEY, outputs);
};
export const deleteOutput = (outputId: string): void => {
    let outputs = getOutputs();
    outputs = outputs.filter(o => o.id !== outputId);
    saveToStorage(OUTPUTS_KEY, outputs);
}
