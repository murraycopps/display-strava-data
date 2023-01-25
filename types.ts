type User = {
    _id: number;
    username: string;
    password: string;
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
};

export type { User };