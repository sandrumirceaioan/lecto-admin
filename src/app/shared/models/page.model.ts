export interface PageImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
}

export interface Page {
    _id?: string;
    titlu: string;
    url: string;
    imagine: PageImage;
    descriere: string;
    status: boolean;
    createdBy?: any;
    createdAt?: Date;
}