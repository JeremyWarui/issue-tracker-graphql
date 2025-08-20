import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// @ts-ignore
import { issues, users, comments } from './data.ts'

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
    }
`

const resolvers = {
    Query: {
        dummy: (): string => "Hello, GraphQL",
        issuesCount: (): Number => issues.length,
        issues: (_, {status, assignedTo}) => {
            return issues.filter(issue => (status === undefined || issue.status === status) && (assignedTo === undefined || issue.assignedTo === assignedTo))
        },
        issue: (_, args) => {
            return issues.find(issue => issue.id === args.id)
        }
        users: () => users,
        user: (_, args) => users.find(user => user.id === args.id)
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