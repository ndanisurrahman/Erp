
export interface EmployeeSkill {
    item: string;
    process: string;
}

export interface Employee {
    id: string;
    name: string;
    designation: string;
    lineNumber: string;
    joinDate: string;
    phone: string;
    skills: EmployeeSkill[];
    nid: string;
    fatherName: string;
    motherName: string;
    isMarried: boolean;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    division: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
    village: string;
    photo: string; // base64 string
}

export interface InputSizeShade {
    size: string;
    shade: string;
    quantity: number;
}

export interface InputData {
    id: string;
    date: string;
    lineNumber: string;
    buyer: string;
    po: string;
    style: string;
    pf: string;
    color: string;
    sewingFinishDate: string;
    sizeShadeQty: InputSizeShade[];
    totalQuantity: number;
}


export interface OutputSizeShade {
    size: string;
    shade: string;
    inputQuantity: number;
    outputQuantity: number;
    balanceQuantity: number;
}

export interface OutputData {
    id: string;
    date: string;
    lineNumber: string;
    buyer: string;
    po: string;
    style: string;
    pf: string;
    color: string;
    sewingFinishDate: string;
    sizeShadeQty: OutputSizeShade[];
    totalOutputQuantity: number;
    totalBalanceQuantity: number;
}
