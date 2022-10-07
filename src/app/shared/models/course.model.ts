export interface CourseImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
}

export interface CourseCertification {
    anc?: boolean;
    participare?: boolean;
}

export interface CoursePrices {
    anc?: number;
    participare?: number;
}


export interface Course {
    _id?: string;
    titlu: string;
    url: string;
    imagine: CourseImage;
    descriere: string;
    certificare: CourseCertification;
    pret: CoursePrices;
    status: boolean;
    createdBy?: any;
    createdAt?: Date;
}