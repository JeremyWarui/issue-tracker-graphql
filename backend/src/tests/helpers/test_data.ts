import mongoose from "mongoose";
import { User } from "../../models/users.ts";
import { Issue } from "../../models/issues.ts";
import { Comment } from "../../models/comments.ts";

export async function generateTestData() {
    // ========================
    // Users
    // ========================
    const aliceId = new mongoose.Types.ObjectId("64d5f1a0f1a1a1a1a1a1a1a1");
    const bobId = new mongoose.Types.ObjectId("64d5f1a0f1a1a1a1a1a1a1a2");
    const carolId = new mongoose.Types.ObjectId("64d5f1a0f1a1a1a1a1a1a1a3");

    const users = [
        new User({ _id: aliceId, name: "Alice Johnson", email: "alice@example.com", hashPwd: "test1234" }),
        new User({ _id: bobId, name: "Bob Smith", email: "bob@example.com", hashPwd: "test1234" }),
        new User({ _id: carolId, name: "Carol Williams", email: "carol@example.com", hashPwd: "test1234" }),
    ];

    await User.insertMany(users);

    // ========================
    // Issues
    // ========================
    const issue1Id = new mongoose.Types.ObjectId("74d5f1a0f1a1a1a1a1a1a1b1");
    const issue2Id = new mongoose.Types.ObjectId("74d5f1a0f1a1a1a1a1a1a1b2");

    const issues = [
        new Issue({
            _id: issue1Id,
            title: "Bug in login flow",
            description: "Users are unable to log in with valid credentials.",
            status: "OPEN",
            assignedTo: null,
            createdAt: new Date("2025-08-01T10:00:00Z"),
            updatedAt: new Date("2025-08-01T10:00:00Z"),
        }),
        new Issue({
            _id: issue2Id,
            title: "Add dark mode",
            description: "Implement dark mode for the dashboard.",
            status: "ASSIGNED",
            assignedTo: aliceId,
            createdAt: new Date("2025-08-02T09:30:00Z"),
            updatedAt: new Date("2025-08-02T09:30:00Z"),
        }),
    ];

    await Issue.insertMany(issues);

    // ========================
    // Comments
    // ========================
    const comments = [
        new Comment({
            _id: new mongoose.Types.ObjectId(),
            content: "I think this is caused by the new auth middleware.",
            author: bobId,
            issue: issue1Id,
            createdAt: new Date("2025-08-01T12:15:00Z"),
        }),
        new Comment({
            _id: new mongoose.Types.ObjectId(),
            content: "Yes, I can reproduce this locally. Working on a fix.",
            author: aliceId,
            issue: issue1Id,
            createdAt: new Date("2025-08-01T13:45:00Z"),
        }),
        new Comment({
            _id: new mongoose.Types.ObjectId(),
            content: "Dark mode should also support system preferences.",
            author: carolId,
            issue: issue2Id,
            createdAt: new Date("2025-08-02T10:00:00Z"),
        }),
    ];

    await Comment.insertMany(comments);

    return { users, issues, comments };
}