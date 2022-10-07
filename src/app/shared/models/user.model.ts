export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
    createdAt: string;
}

export interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

export interface Credentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface LoginResponse {
    user: User,
    tokens: {
        access_token: string;
        refresh_token: string;
    }
}

export interface UsersPaginated {
    users: User[];
    total: number;
}