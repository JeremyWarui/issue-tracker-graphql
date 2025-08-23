import { gql } from "@apollo/client";

export const ALL_ISSUES = gql`
    query allIssues($status: String, $assignedTo: String) {
       issues(status: $status, assignedTo: $assignedTo) {
           title
           description
           status
           createdAt
           updatedAt
           assignedTo {
               name
           }
       } 
    }

`
