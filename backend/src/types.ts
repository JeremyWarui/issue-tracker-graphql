// types or interfaces defination

export type IssueStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    status: IssueStatus;
    assignedTo?: string | null // userId or undefined
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    content: string;
    issue: string;
    authorId: string;
    createdAt: string;
}
