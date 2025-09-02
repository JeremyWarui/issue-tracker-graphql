// import type { Issue, Comment, User } from "../types.ts";
import { GraphQLError } from "graphql";
import { User } from "../models/users.ts";
import { Issue } from "../models/issues.ts";
import { Comment } from "../models/comments.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    dummy: (): string => "Hello, GraphQL",
    issuesCount: async (_: any, args: any): Promise<number> => {
      if (args.status) {
        return Issue.countDocuments({ status: args.status });
      }
      return Issue.countDocuments({});
    },
    issues: async (_: any, args: any): Promise<any[]> => {
      const filter: any = {};
      if (args.status !== undefined) {
        filter.status = args.status;
      }
      if (args.assignedTo !== undefined) {
        filter.assignedTo = args.assignedTo;
      }
      return Issue.find(filter).populate("assignedTo").populate("comments");
    },
    issue: async (_: any, args: { id: string }): Promise<any> => {
      return Issue.findById(args.id)
        .populate("assignedTo")
        .populate("comments");
    },
    users: async (): Promise<any[]> => {
      return User.find({}).populate("assignedIssues");
    },
    user: async (_: any, args: { id: string }): Promise<any> => {
      return User.findById(args.id).populate("assignedIssues");
    },
    me: (_: any, args: any, context: any) => {
      return context.currentUser
    }
  },
  Issue: {
    comments: async (parent: any): Promise<any[]> => {
      return Comment.find({ issue: parent._id }).populate("author");
    },
    assignedTo: async (parent: any): Promise<any> => {
      if (!parent.assignedTo) return null;
      return User.findById(parent.assignedTo);
    },
  },
  Comment: {
    author: async (parent: any): Promise<any> => {
      return User.findById(parent.author);
    },
    issue: async (parent: any): Promise<any> => {
      return Issue.findById(parent.issue);
    },
  },
  User: {
    assignedIssues: async (parent: any): Promise<any[]> => {
      return Issue.find({ assignedTo: parent._id });
    },
  },
  Mutation: {
    // - createUser
    createUser: async (
      _: any,
      args: { name: string; email: string; hashPwd: string }
    ): Promise<any> => {
      if (!args.name || !args.email) {
        throw new GraphQLError(`name and email are required`, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (args.hashPwd.length < 8) {
        throw new GraphQLError(`password requires more than 8 characters`, {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      //hash
      const saltRounds = 12;
      const hashedPwd = await bcrypt.hash(args.hashPwd, saltRounds)

      const user = new User({
        name: args.name,
        email: args.email,
        hashPwd: hashedPwd
      });

      try {
        await user.save();
      } catch (error) {
        if ((error as any)?.code === 11000) {
          throw new GraphQLError("name must be unique", {
            extensions: { code: "BAD_USER_INPUT" }
          })
        }
        throw new GraphQLError("saving person failed", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.name, error },
        });
      }

      return user;
    },
    // login user
    login: async (_: any, args: { name: string; identifier: string }) => {
      if (!args.name || !args.identifier) {
        throw new GraphQLError(`name and password are required`, {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      const user = await User.findOne({ name: args.name })


      if (!user) {
        throw new GraphQLError(`user not found`)
      }

      //compare password
      const isValidPassword = await bcrypt.compare(args.identifier, user.hashPwd)
      if (!isValidPassword) {
        throw new GraphQLError(`Invalid credentials`, {
          extensions: { code: "UNAUTHENTICATED" }
        })
      }

      //generate token
      const userForToken = {
        name: user.name,
        id: user._id
      }

      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        throw new GraphQLError("SECRET_KEY environment variable is not set", {
          extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
      }

      const token = jwt.sign(userForToken, secretKey, { expiresIn: "12h" });

      return { value: token }

    }
    ,
    // - delete user
    deleteUser: async (_: any, args: { id: string }): Promise<any> => {
      const userId: string = args.id;
      if (!userId)
        throw new GraphQLError("user id must be input", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      try {
        return await User.findOneAndDelete({ _id: userId });
      } catch (error) {
        throw new GraphQLError("user not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
    // - createIssue
    createIssue: async (
      _: any,
      args: { title: string; description: string }
    ): Promise<any> => {
      if (!args.title || !args.description) {
        throw new GraphQLError(`title and description is required`, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const issue = new Issue({
        title: args.title,
        description: args.description.trim(),
        status: "OPEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
      });

      try {
        await issue.save();
      } catch (error) {
        throw new GraphQLError("failed to save the issue", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }

      return issue;
    },
    // - assignIssue
    assignIssue: async (
      _: any,
      args: { id: string; userId: string }
    ): Promise<any> => {
      if (!args.id || !args.userId) {
        throw new GraphQLError(`id and userId is required`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const user = await User.findById(args.userId);
      if (!user) {
        throw new GraphQLError(`user not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const issue = await Issue.findById(args.id);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      issue.assignedTo = user._id;
      issue.status = "ASSIGNED";
      issue.updatedAt = new Date().toISOString();

      // Update user's assignedIssues array
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { assignedIssues: issue._id },
      });

      return await issue.save();
    },
    // - updateIssueStatus
    updateIssueStatus: async (
      _: any,
      args: {
        id: string;
        status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
      }
    ): Promise<any> => {
      if (!args.id || !args.status) {
        throw new GraphQLError(`id and status is required`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const issue = await Issue.findById(args.id);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      issue.status = args.status;
      issue.updatedAt = new Date().toISOString();

      return await issue.save();
    },
    // - addComment
    addComment: async (
      _: any,
      args: { content: string; author: string; issueId: string }
    ): Promise<any> => {
      if (!args.issueId || !args.content) {
        throw new GraphQLError(`issueId and content is required`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (!args.author) {
        throw new GraphQLError(`author is required`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const user = await User.findById(args.author);
      if (!user) {
        throw new GraphQLError(`user not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const issue = await Issue.findById(args.issueId);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const comment = new Comment({
        content: args.content,
        author: user._id,
        issue: issue._id,
        createdAt: new Date().toISOString(),
      });

      const savedComment = await comment.save();

      // Update issue's comments array
      await Issue.findByIdAndUpdate(issue._id, {
        $push: { comments: savedComment._id },
      });

      return savedComment;
    },
  },
};
