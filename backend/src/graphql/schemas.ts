export const typeDefs = `
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
    
    type Token {
      value: String!
    }
    
    type Query {
      dummy: String!
      issuesCount(status: String): Int!
      issues(status: String, assignedTo: String): [Issue!]!
      issue(id: ID!): Issue!
      users: [User!]!
      user(id: ID!): User!
      me: User
    }
    
    type Mutation {
      createUser(
        name: String!
        email: String!
      ): User!
      deleteUser(id: ID!): User!
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
      login(
        name: String!
        password: String!
      ): Token
    }
`;