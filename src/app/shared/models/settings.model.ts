export interface Settings {
    _id?: string;
    title: string;
    summary: string;
    description: string;
    currency: string;
    company?: {
        name: string;
        description: string;
        cui: string;
        j: string;
    };
    contact?: {
        address: string;
        phones: {
            type: string;
            number: string;
            person: string;
        }[];
        email: string;
        web: string;
    };
    social?: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    };
    meta?: {
        title: string;
        description: string;
        keywords: string;
        author: string;
        robots: string;
    };
    createdBy?: any;
    createdAt?: Date;
}