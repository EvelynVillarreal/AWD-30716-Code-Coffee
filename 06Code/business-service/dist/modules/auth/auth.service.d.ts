export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    province?: string;
};
export type LoginInput = {
    email: string;
    password: string;
};
export declare const authService: {
    register: (input: RegisterInput) => Promise<{
        user: any;
        token: string;
    }>;
    login: (input: LoginInput) => Promise<{
        user: any;
        token: string;
    }>;
};
