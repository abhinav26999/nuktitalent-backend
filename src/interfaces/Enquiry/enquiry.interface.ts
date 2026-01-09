export interface IEnquiryRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface IUpdateEnquiry {
    isSolved?: boolean;
    remarks?: string;
}
