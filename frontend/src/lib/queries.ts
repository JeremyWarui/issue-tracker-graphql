import { gql } from "@apollo/client";

export const ALL_ISSUES_AND_USERS = gql`
    query allIssuesAndUsers($status: String, $assignedTo: String) {
        issues(status: $status, assignedTo: $assignedTo) {
            id
            title
            description
            status
            updatedAt
            assignedTo {
                id
                name
            }
            comments {
                id
            }
        }
        users {
            id
            name
        }
    }
`

export const GET_ISSUE = gql(`
    query getIssue($id: ID!) {
        issue(id: $id) {
            id
            title
            description
            status
            createdAt
            updatedAt
            assignedTo {
                id
                name
            }
            comments {
                id
                content
                createdAt
                author {
                    id
                    name
                }
            }
        }
        users {
            id
            name
        }
    }
`)

export const ALL_USERS = gql`
    query allUsers {
        users {
            id
            name
            email
            assignedIssues {
                id
            }
        }
    }

`

export const CREATE_ISSUE = gql(`
    mutation createIssue($title: String!, $description: String!) {
        createIssue (title: $title, description: $description) {
            id
            title
            description
            status
            createdAt
            updatedAt
        }
    }
`)

export const ASSIGN_ISSUE = gql( `
    mutation assignIssue($id: ID!, $userId: String!) {
        assignIssue(id: $id, userId: $userId) {
            id
            title
            description
            status
            assignedTo {
                name
            }
            updatedAt
        }
    }
  `
)

export const UPDATE_ISSUE_STATUS = gql`
    mutation updateIssueStatus($id: ID!, $status: IssueStatus!) {
        updateIssueStatus(id: $id, status: $status) {
            id
            title
            description
            status
        }
    }
`

export const CREATE_COMMENT = gql`
    mutation createComment($content: String!, $author: String!, $issueId: String!) {
        addComment(content: $content, author: $author, issueId: $issueId) {
            id
            content
            author {
                id
                name
            }
            createdAt
        }
    }
`