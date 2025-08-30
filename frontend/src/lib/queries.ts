import { gql } from "@apollo/client";


const USER_INFO = gql`
    fragment UserInfo on User {
        id
        name
        email
    }
`

const ISSUE_SUMMARY = gql`
    fragment IssueSummary on Issue {
        id
        title
        description
        status
        createdAt
        updatedAt
        assignedTo {
            ...UserInfo
        }
        comments {
            id
        }
    }
    ${USER_INFO}
`

const ISSUE_DETAIL = gql`
    fragment IssueDetails on Issue {
        id
        title
        description
        status
        createdAt
        updatedAt
        assignedTo {
            ...UserInfo
        }
        comments {
            id
            content
            createdAt
            author {
                ...UserInfo
            }
        }
    }
    ${USER_INFO}
`

export const ALL_ISSUES_AND_USERS = gql`
    query allIssuesAndUsers($status: String, $assignedTo: String) {
        issues(status: $status, assignedTo: $assignedTo) {
            ...IssueSummary
        }
        users {
            ...UserInfo
        }
    }
    ${ISSUE_SUMMARY}
    ${USER_INFO}
`

export const GET_ISSUE = gql`
    query getIssue($id: ID!) {
        issue(id: $id) {
            ...IssueDetails
        }
        users {
            ...UserInfo
        }
    }
    ${ISSUE_DETAIL}
    ${USER_INFO}
`

export const ALL_USERS = gql`
    query allUsers {
        users {
            ...UserInfo
            assignedIssues {
                id
            }
        }
    }
    ${USER_INFO}
`

export const GET_USER = gql`
    query user($id: String!) {
        user(id: $id) {
            ...UserInfo
            assignedIssues {
                id
            }
        }
    }
    ${USER_INFO}
`

export const CREATE_USER = gql`
    mutation addUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, hashPwd: $password) {
            ...UserInfo
            assignedIssues {
                id
            }
        }
    }
    ${USER_INFO}
`

export const LOGIN_USER = gql`
    mutation login($name: String!, $identifier: String!) {
        login(name: $name, identifier: $identifier){
            value
        }
    }

`

export const GET_CURRENT_USER = gql`
    query Me {
        me {
            ...UserInfo
        }
    }
    ${USER_INFO}
`

export const DELETE_USER  = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            ...UserInfo
        }
    }
    ${USER_INFO}
`

export const CREATE_ISSUE = gql`
    mutation createIssue($title: String!, $description: String!) {
        createIssue (title: $title, description: $description) {
            ...IssueSummary
        }
    }
    ${ISSUE_SUMMARY}
`

export const ASSIGN_ISSUE = gql`
    mutation assignIssue($id: ID!, $userId: String!) {
        assignIssue(id: $id, userId: $userId) {
            ...IssueSummary
        }
    }
    ${ISSUE_SUMMARY}
`

export const UPDATE_ISSUE_STATUS = gql`
    mutation updateIssueStatus($id: ID!, $status: IssueStatus!) {
        updateIssueStatus(id: $id, status: $status) {
            ...IssueSummary
        }
    }
    ${ISSUE_SUMMARY}
`

export const CREATE_COMMENT = gql`
    mutation createComment($content: String!, $author: String!, $issueId: String!) {
        addComment(content: $content, author: $author, issueId: $issueId) {
            id
            content
            author {
                ...UserInfo
            }
            createdAt
        }
    }
    ${USER_INFO}
`





export const GET_ISSUES_SUMMARY = gql`
    query getIssuesSummary {
        issues {
            id
            title
            status
            updatedAt
            assignedTo {
                id
                name
            }
        }
    }
`

export const GET_USER_ASSIGNMENTS = gql`
    query getUserAssignments($userId: String!) {
        issues(assignedTo: $userId) {
            ...IssueDetails
        }
    }
    ${ISSUE_DETAIL}
`