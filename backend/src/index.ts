import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// @ts-ignore
import {issues, users, comments, Issue, User} from './data.ts'

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
      issuesCount: Int!
      issues(status: String, assignedTo: String): [Issue!]!
      issue(id: ID!): Issue!
      users: [User!]!
      user(id: ID!): User!
    }
`

const resolvers = {
    Query: {
        dummy: (): string => "Hello, GraphQL",
        issuesCount: (): Number => issues.length,
        issues: (_ :any, args:any):Issue[] => {
            return issues.filter(issue => (args.status === undefined || issue.status === args.status) && (args.assignedTo === undefined || issue.assignedTo === args.assignedTo))
        },
        issue: (_:any, args:any): Issue | undefined => {
            return issues.find(issue => issue.id === args.id)
        },
        users: (): User[] => users,
        user: (_: any, args: any) => {
            return users.find(user => user.id === args.id)
        }
    },
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      issues,
      users,
      comments
    }
  }
});

console.log(`🚀  Server ready at: ${url}`)