export interface User {
    id: string
    name: string
    email?: string
    createdAt: Date
}

export interface Issue {
    id: string
    title: string
    description: string
    status: IssueStatus
    // assigneeId?: string
    assignedTo?: User
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
    createdAt: Date
}

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "RESOLVED"

export interface DashboardStats {
    total: number
    open: number
    inProgress: number
    closed: number
    resolved: number
}
