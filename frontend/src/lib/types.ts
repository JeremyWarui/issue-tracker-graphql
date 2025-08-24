export interface User {
    id: string
    name: string
    email?: string
    assignedIssues: Issue[]
}

export interface Issue {
    id: string
    title: string
    description: string
    status: IssueStatus
    // assigneeId?: string
    assignedTo: User
    createdAt: Date
    updatedAt: Date
    comments: Comment[]
}

export interface Comment {
    id: string
    content: string
    // authorId: string
    author: User
    issueId: string
    createdAt: string
}

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "RESOLVED" | "ASSIGNED"

export interface DashboardStats {
    total: number
    open: number
    inProgress: number
    closed: number
    resolved: number
}


export type IssueQueryData = {
    issue: Issue;
    users: User[];
};