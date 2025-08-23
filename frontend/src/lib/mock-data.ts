import type { User, Issue, Comment, DashboardStats } from "./types"

export const mockUsers: User[] = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice@example.com",
        createdAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob@example.com",
        createdAt: new Date("2024-01-20"),
    },
    {
        id: "3",
        name: "Carol Davis",
        email: "carol@example.com",
        createdAt: new Date("2024-02-01"),
    },
    {
        id: "4",
        name: "David Wilson",
        email: "david@example.com",
        createdAt: new Date("2024-02-10"),
    },
]

export const mockComments: Comment[] = [
    {
        id: "1",
        content: "I can reproduce this issue on Chrome as well.",
        authorId: "2",
        author: mockUsers[1],
        issueId: "1",
        createdAt: new Date("2024-03-02"),
    },
    {
        id: "2",
        content: "Working on a fix for this.",
        authorId: "1",
        author: mockUsers[0],
        issueId: "1",
        createdAt: new Date("2024-03-03"),
    },
    {
        id: "3",
        content: "This might be related to the recent API changes.",
        authorId: "3",
        author: mockUsers[2],
        issueId: "2",
        createdAt: new Date("2024-03-05"),
    },
]

export const mockIssues: Issue[] = [
    {
        id: "1",
        title: "Login button not responding on mobile",
        description:
            "The login button becomes unresponsive on mobile devices after the recent update. Users are unable to authenticate.",
        status: "in-progress",
        assigneeId: "1",
        assignee: mockUsers[0],
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-03"),
        comments: mockComments.filter((c) => c.issueId === "1"),
    },
    {
        id: "2",
        title: "API endpoint returning 500 error",
        description:
            "The /api/users endpoint is consistently returning 500 internal server errors when fetching user data.",
        status: "open",
        assigneeId: "2",
        assignee: mockUsers[1],
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-05"),
        comments: mockComments.filter((c) => c.issueId === "2"),
    },
    {
        id: "3",
        title: "Dashboard loading performance issue",
        description: "The main dashboard takes over 10 seconds to load, causing poor user experience.",
        status: "open",
        createdAt: new Date("2024-03-08"),
        updatedAt: new Date("2024-03-08"),
        comments: [],
    },
    {
        id: "4",
        title: "Email notifications not working",
        description: "Users are not receiving email notifications for issue updates and comments.",
        status: "resolved",
        assigneeId: "3",
        assignee: mockUsers[2],
        createdAt: new Date("2024-02-28"),
        updatedAt: new Date("2024-03-07"),
        comments: [],
    },
    {
        id: "5",
        title: "Dark mode toggle broken",
        description: "The dark mode toggle in settings is not working properly and reverts to light mode.",
        status: "closed",
        assigneeId: "4",
        assignee: mockUsers[3],
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date("2024-03-01"),
        comments: [],
    },
]

export const mockStats: DashboardStats = {
    total: mockIssues.length,
    open: mockIssues.filter((issue) => issue.status === "open").length,
    inProgress: mockIssues.filter((issue) => issue.status === "in-progress").length,
    closed: mockIssues.filter((issue) => issue.status === "closed").length,
    resolved: mockIssues.filter((issue) => issue.status === "resolved").length,
}
