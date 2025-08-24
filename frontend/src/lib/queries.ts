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