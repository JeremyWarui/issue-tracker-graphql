import { ApolloServer } from "@apollo/server";
import { startStandaloneServer} from "@apollo/server/standalone";

const typeDefs = `
    type User {
      id: ID!
      name: String!
      email: String!
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
        dummy: (): string => "Hello, GraphQL"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${ url }`)