type User = {
    _id: string;
    username: string;
    password: string;
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    goals?: Goal[];
};

type Goal = {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
};

export type { User, Goal };