import { Course, CourseCertification, CoursePrices } from "./course.model";
import { Discount, DiscountFidelitate, DiscountInscriere, DiscountVolum } from "./discount.model";
import { Location } from "./location.model";
import { Teacher } from "./teacher.model";

export type SessionType = "online" | "local";

export interface SessionCourse {
    data: Course
    teachers: Teacher[];
    discounts: {
        volum: DiscountVolum[],
        inscriere: DiscountInscriere[],
        fidelitate: DiscountFidelitate[]
    };
    options: {
        certificare?: CourseCertification;
        pret: CoursePrices;
    }
};

export class SessionLocation {
    data: Location;
    oferte: any[];
}

export interface Session {
    _id?: string;
    titlu: string;
    url?: string;
    type: SessionType;
    status: boolean;
    descriere?: string;
    inscriere: {
        start: Date;
        end: Date;
    };

    perioada: {
        start: Date;
        end: Date;
    };
    cursuri?: SessionCourse[];
    locatie?: SessionLocation;
    createdBy?: any;
    createdAt?: Date;
}