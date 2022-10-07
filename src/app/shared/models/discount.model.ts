export type CategorieDiscount = "volum" | "inscriere" | "fidelitate";

export interface DiscountVolum {
    min_cursanti: number;
    max_cursanti?: number;
    type: "fix" | "procent";
    value: number;
}

export interface DiscountInscriere {
    max_inscriere: Date;
    type: "fix" | "procent";
    value: number;
}

export interface DiscountFidelitate {
    participare: number;
    consecutiva?: boolean;
    type: "fix" | "procent";
    value: number;
}

export interface Discount {
    _id?: string;
    categorie: CategorieDiscount;
    volum?: DiscountVolum[];
    inscriere?: DiscountInscriere[];
    fidelitate?: DiscountFidelitate[];
    descriere?: string;
    activ: boolean;
    createdBy?: any;
    createdAt?: Date;
}

export interface DiscountsPaginated {
    discounts: Discount[];
    total: number;
}

