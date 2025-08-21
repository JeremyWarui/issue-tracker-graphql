import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v1 as uuid } from "uuid";

import type { Issue, Comment, User } from "./types.ts";
// @ts-ignore
import { issues, users, comments } from "./data.ts";
import { GraphQLError } from "graphql";

const typeDefs = `
    type User {
      id: ID!
      name: String!
      email: String!
      assignedIssues: [Issue]
    }
    
    enum IssueStatus {
      OPEN
      ASSIGNED
      IN_PROGRESS
      RESOLVED
      CLOSED
    }
    
    type Issue {
      id: ID!
      title: String!
      description: String!
      status: IssueStatus!
      createdAt: String!
      updatedAt: String!
      assignedTo: User
      comments: [Comment]
    }
    
    type Comment {
      id: ID!
      content: String!
      author: User!
      issue: Issue!
      createdAt: String!
    }
    
    type Query {
      dummy: String!
      issuesCount(status: String): Int!
      issues(status: String, assignedTo: String): [Issue!]!
      issue(id: ID!): Issue!
      users: [User!]!
      user(id: ID!): User!
    }
    
    type Mutation {
      createUser(
        name: String!
        email: String!
      ): User!
      createIssue(
        title: String!
        description: String!
      ): Issue!
      updateIssueStatus(
        id: ID!
        status: IssueStatus!
      ): Issue!
      assignIssue(
        id: ID!
        userId: String!
      ): Issue!
      addComment(
        content: String!
        author: String!
        issueId: String!
      ): Comment!
    }
`;

const resolvers = {
  Query: {
    dummy: (): string => "Hello, GraphQL",
    issuesCount: (_: any, args: Issue): number => {
      if (!args.status) {
        return issues.length
      }
      return issues.filter((issue: Issue) => issue.status === args.status).length

    } ,
    issues: (_: any, args: Issue): Issue[] => {
      return issues.filter(
        (issue: Issue) =>
          (args.status === undefined || issue.status === args.status) &&
          (args.assignedTo === undefined ||
            issue.assignedTo === args.assignedTo)
      );
    },
    issue: (_: any, args: Issue): Issue | undefined => {
      return issues.find((issue:Issue) => issue.id === args.id);
    },
    users: (): User[] => users,
    user: (_: any, args: User): User | undefined => {
      return users.find((user: User) => user.id === args.id);
    },
  },
  Issue: {
    comments: (_:Issue): Comment[] => {
      // console.log(root)
      // return []
      return comments.filter((comment: Comment) => comment.issueId === _.id);
    },
    assignedTo: (_:Issue): User | undefined => {
      //console.log(_)
      return users.find((user: User) => user.id === _.assignedTo);
    },
  },
  Comment: {
    author: (_: Comment): User | undefined => {
      // console.log(_)
      return users.find((user: User) => user.id === _.author);
    },
    issue: (_: Comment): Issue | undefined => {
      return issues.find((issue:Issue) => issue.id === _.issueId)
    }
  },
  User: {
    assignedIssues: (_: User):Issue[] => {
      // console.log(_)
      return issues.filter((issue: Issue) => issue.assignedTo === _.id);
    },
  },
  Mutation: {
    // - createUser
    createUser: (_: any, args: { name: string, email: string }): User => {
      if (!args.name || !args.email) {
        throw new GraphQLError(`name and email are required`, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const user = {...args, id: uuid()};
      users.push(user);
      return user;
    },
    // - createIssue
    createIssue: (_: any, args: { title: string, description: string }): Issue => {
      if (!args.title || !args.description) {
        throw new GraphQLError(`title and description is required`, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const issue: Issue = {
        id: uuid(),
        ...args,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        status: "OPEN",
      };
      issues.push(issue);
      return issue;
    },
    // - assignIssue
    assignIssue: (_: any, args: any): Issue => {
      if (!args.id || !args.userId) {
        throw new GraphQLError(`id and userId is required`, {
          extensions: {code: "BAD_USER_INPUT"},
        });
      }
      const user = users.find((user: User) => user.id === args.userId);
      if (!user) {
        throw new GraphQLError(`user not found`, {
          extensions: {code: "NOT_FOUND"},
        });
      }
      const issue = issues.find((issue: Issue) => issue.id === args.id);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: {code: "NOT_FOUND"},
        });
      }
      issue.assignedTo = user.id;
      issue.status = "ASSIGNED";
      issue.updatedAt = new Date().toISOString()
      return issue;
    },
    // - updateIssueStatus
    updateIssueStatus: (_: any, args: any) => {
      if (!args.id || !args.status) {
        throw new GraphQLError(`id and status is required`, {
          extensions: {code: "BAD_USER_INPUT"},
        });
      }

      const issue = issues.find((issue: Issue) => issue.id === args.id);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: {code: "NOT_FOUND"},
        });
      }

      issue.status = args.status;
      issue.updatedAt = new Date().toISOString()
      return issue;
    },
    // - addComment
    addComment: (_: any, args: any): Comment => {
      if (!args.issueId || !args.content) {
        throw new GraphQLError(`issueId and content is required`, {
          extensions: {code: "BAD_USER_INPUT"},
        });
      }
      if (!args.author) {
        throw new GraphQLError(`user is required`, {
          extensions: {code: "BAD_USER_INPUT"},
        });
      }

      const user = users.find((user: User) => user.id === args.author);
      if (!user) {
        throw new GraphQLError(`user not found`, {
          extensions: {code: "NOT_FOUND"},
        });
      }
      const issue = issues.find((issue: Issue) => issue.id === args.issueId);
      if (!issue) {
        throw new GraphQLError(`issue not found`, {
          extensions: {code: "NOT_FOUND"},
        });
      }

      const comment = {
        id: uuid(),
        createdAt: new Date().toISOString(),
        author: args.author,
          issueId: args.issueId,
        content: args.content,
      };

      comments.push(comment);
      return comment;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      issues,
      users,
      comments,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
