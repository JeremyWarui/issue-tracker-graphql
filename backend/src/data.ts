// data.js
import type { Issue, User, Comment } from "./types.ts";

// ========================
// Users
// ========================
export const users: User[] = [
  {
    id: "u1a2b3c4-d5e6-789f-1011-121314151617",
    name: "Alice Johnson",
    email: "alice@example.com",
  },
  {
    id: "u2b3c4d5-e6f7-8901-1121-314151617181",
    name: "Bob Smith",
    email: "bob@example.com",
  },
  {
    id: "u3c4d5e6-f7g8-9011-2131-415161718192",
    name: "Carol Williams",
    email: "carol@example.com",
  },
];

// ========================
// Issues
// ========================
export const issues: Issue[] = [
  // OPEN (no assignee)
  {
    id: "i1a2b3c4-d5e6-789f-1011-121314151617",
    title: "Bug in login flow",
    description: "Users are unable to log in with valid credentials.",
    status: "OPEN",
    assignedTo: null,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
  },

  // ASSIGNED
  {
    id: "i2b3c4d5-e6f7-8901-1121-314151617181",
    title: "Add dark mode",
    description: "Implement dark mode for the dashboard.",
    status: "ASSIGNED",
    assignedTo: "u1a2b3c4-d5e6-789f-1011-121314151617", // Alice
    createdAt: "2025-08-02T09:30:00Z",
    updatedAt: "2025-08-02T09:30:00Z",
  },

  // IN_PROGRESS
  {
    id: "i3c4d5e6-f7g8-9011-2131-415161718192",
    title: "Database schema migration",
    description: "Refactor schema to support comments on issues.",
    status: "IN_PROGRESS",
    assignedTo: "u2b3c4d5-e6f7-8901-1121-314151617181", // Bob
    createdAt: "2025-08-03T08:45:00Z",
    updatedAt: "2025-08-04T15:20:00Z",
  },

  // RESOLVED
  {
    id: "i4d5e6f7-g8h9-0121-3141-516171819202",
    title: "Fix typo on homepage",
    description: "Correct the spelling of 'Welcom' to 'Welcome'.",
    status: "RESOLVED",
    assignedTo: "u3c4d5e6-f7g8-9011-2131-415161718192", // Carol
    createdAt: "2025-08-05T11:10:00Z",
    updatedAt: "2025-08-05T12:00:00Z",
  },

  // CLOSED
  {
    id: "i5e6f7g8-h9i0-1213-1415-161718192021",
    title: "Implement CI/CD pipeline",
    description: "Set up GitHub Actions for automated testing and deployment.",
    status: "CLOSED",
    assignedTo: "u1a2b3c4-d5e6-789f-1011-121314151617", // Alice
    createdAt: "2025-08-06T14:00:00Z",
    updatedAt: "2025-08-07T09:00:00Z",
  },
];

// ========================
// Comments
// ========================
export const comments: Comment[] = [
  {
    id: "c1a2b3c4-d5e6-789f-1011-121314151617",
    content: "I think this is caused by the new auth middleware.",
    issueId: "i1a2b3c4-d5e6-789f-1011-121314151617", // Bug in login flow
    author: "u2b3c4d5-e6f7-8901-1121-314151617181", // Bob
    createdAt: "2025-08-01T12:15:00Z",
  },
  {
    id: "c2b3c4d5-e6f7-8901-1121-314151617181",
    content: "Yes, I can reproduce this locally. Working on a fix.",
    issueId: "i1a2b3c4-d5e6-789f-1011-121314151617", // Bug in login flow
    author: "u1a2b3c4-d5e6-789f-1011-121314151617", // Alice
    createdAt: "2025-08-01T13:45:00Z",
  },
  {
    id: "c3c4d5e6-f7g8-9011-2131-415161718192",
    content: "Dark mode should also support system preferences.",
    issueId: "i2b3c4d5-e6f7-8901-1121-314151617181", // Add dark mode
    author: "u3c4d5e6-f7g8-9011-2131-415161718192", // Carol
    createdAt: "2025-08-02T10:00:00Z",
  },
  {
    id: "c4d5e6f7-g8h9-0121-3141-516171819202",
    content: "Schema migration might break old data, need to plan carefully.",
    issueId: "i3c4d5e6-f7g8-9011-2131-415161718192", // DB migration
    author: "u1a2b3c4-d5e6-789f-1011-121314151617", // Alice
    createdAt: "2025-08-03T09:00:00Z",
  },
  {
    id: "c5e6f7g8-h9i0-1213-1415-161718192021",
    content: "Typo fixed and merged into main branch 🎉",
    issueId: "i4d5e6f7-g8h9-0121-3141-516171819202", // Fix typo homepage
    author: "u3c4d5e6-f7g8-9011-2131-415161718192", // Carol
    createdAt: "2025-08-05T12:05:00Z",
  },
  {
    id: "c6f7g8h9-i0j1-2131-4151-617181920212",
    content: "CI/CD pipeline successfully deployed to staging.",
    issueId: "i5e6f7g8-h9i0-1213-1415-161718192021", // CI/CD pipeline
    author: "u2b3c4d5-e6f7-8901-1121-314151617181", // Bob
    createdAt: "2025-08-07T09:30:00Z",
  },
];

