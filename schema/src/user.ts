import { Resume } from './resume';
export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    password?: string;
    count: number;
    isSubscriber:boolean;
    // provider: 'email' | 'google';
    resetToken?: string;
    resumes: Resume[];
    createdAt: string;
    updatedAt: string;
};
