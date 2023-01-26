type User = {
    _id: number;
    username: string;
    password: string;
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    goals?: Goal[];
};

type Goal = {
    _id: number;
    name: string;
    description: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
};

export type { User, Goal };