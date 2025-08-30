"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IssueModal } from "./IssueModal";
import { PageLayout } from "./PageLayout";
// import { mockUsers } from "../lib/mock-data";
import type { IssueStatus, Issue, User as UserType } from "../lib/types";
import { Search, Plus, Eye, Edit, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { STATUS_OPTIONS_WITH_ALL, getStatusBadgeColor } from "@/lib/utils";

// use data from GraphQL
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ALL_ISSUES_AND_USERS,
  ASSIGN_ISSUE,
  CREATE_ISSUE,
  UPDATE_ISSUE_STATUS,
} from "@/lib/queries.ts";
import { LoadingIssuesList } from "@/components/loading";
import { toast } from "sonner"
// create issue or update issue

export function IssuesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const { loading, error, data } = useQuery(ALL_ISSUES_AND_USERS);
  // create issue
  const [createIssue] = useMutation(CREATE_ISSUE, {
    refetchQueries: [{ query: ALL_ISSUES_AND_USERS }],
  });
  // assign issue
  const [assignIssue] = useMutation(ASSIGN_ISSUE, {
    refetchQueries: [{ query: ALL_ISSUES_AND_USERS }],
  });
  // update status of issue
  const [updateIssueStatus] = useMutation(UPDATE_ISSUE_STATUS, {
    refetchQueries: [{ query: ALL_ISSUES_AND_USERS }],
  });

  if (loading) return <LoadingIssuesList />;
  if (error) return `Error! ${error.message}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { issues, users } = data;
  // console.log("issues in list: ", issues);
  // console.log("users in list: ", users)

  const filteredIssues = issues.filter((issue: Issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !issue.assignedTo) ||
      (issue.assignedTo && issue.assignedTo.id === assigneeFilter);
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleCreateIssue = async (issueData: Partial<Issue>) => {
    console.log("Creating issue:", issueData);
    try {
      await createIssue({ variables: { ...issueData } });
      toast.success("Issue created successfully!")
    } catch (error) {
      toast.error("Failed to create issue.Please try again.", {
        description: `error occured ${error}`
      })
    }
    
  };

  const handleEditIssue = async (issueData: Partial<Issue>) => {
    console.log("Updating issue:", issueData);
    console.log("issue status: ", issueData.status);
    try {
      if (issueData.status === "OPEN") {
      await assignIssue({
        variables: {
          id: issueData.id,
          userId: issueData.assignedTo?.id,
        },
      });
      toast.success("Issue assigned successfully")
    }

    if (issueData.status !== "OPEN") {
      await updateIssueStatus({
        variables: {
          id: issueData.id,
          status: issueData.status,
        },
      });
      toast.success("Issue status updated successfully!")
    }

    } catch(error) {
      toast.error("Failed to update issue. Please try again", {
        description: `Error: ${error}`
      })
    }
    
  };

  const openEditModal = (issue: Issue) => {
    // console.log("Updating issue:", issue);
    // console.log("users passed on for editing:", users);
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  return (
    <PageLayout
      title="Issues"
      subtitle="Track and manage all project issues"
    >
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className={"flex flex-row justify-between"}>
            <CardTitle className="text-2xl">Issue Management</CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-fit bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Issue
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>

                  {/*update the users*/}

                  {users.map((user: UserType) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                {STATUS_OPTIONS_WITH_ALL.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      statusFilter === option.value ? "default" : "outline"
                    }
                    className={
                      statusFilter === option.value
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">
              Issues ({filteredIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No issues found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue: Issue) => (
                  <div
                    key={issue.title}
                    className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 hover:bg-white transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-foreground truncate">
                          {issue.title}
                        </h3>
                        <Badge
                          className={`text-xs ${getStatusBadgeColor(
                            issue.status
                          )}`}
                        >
                          {issue.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>
                            {issue.assignedTo
                              ? issue.assignedTo.name
                              : "Unassigned"}
                          </span>
                        </div>
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(issue.updatedAt, {
                            addSuffix: true,
                          })}
                        </span>
                        <span>
                          {issue.comments.length} comment
                          {issue.comments.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/issues/${issue.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(issue)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <IssueModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCreateIssue}
      />

      <IssueModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        issue={editingIssue}
        users={users}
        onSave={handleEditIssue}
      />
    </PageLayout>
  );
}
