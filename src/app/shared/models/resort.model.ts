export interface GalleryImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
    main?: boolean;
}

export interface Localitate {
    nume?: string;
    simplu?: string;
}

export interface LocationGroup {
    nume: string;
    localitati: { nume?: string; simplu?: string; }[];
}

export interface Resort {
    _id?: string;
    resort: string;
    url: string;
    imagine?: GalleryImage;
    descriere?: string;
    oras: string;
    judet: string;
    status: boolean;
    createdBy?: any;
    createdAt?: Date;
}