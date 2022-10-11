import { Course, CourseCertification, CoursePrices } from "./course.model";
import { Discount } from "./discount.model";
import { Teacher } from "./teacher.model";

export type SessionType = "online" | "local";

export interface SessionCourse {
    course: Course;
    options: {
        discounts: Discount[];
        teachers: Teacher[];
        certificare?: CourseCertification;
        pret?: CoursePrices;
    }
};

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
    locatie?: Location;
    createdBy?: any;
    createdAt?: Date;
}