"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IssueModal } from "./IssueModal";
import { PageLayout } from "./PageLayout";
import type { IssueStatus, Issue } from "../lib/types";
import { Search, Eye, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { STATUS_OPTIONS_WITH_ALL, getStatusBadgeColor } from "@/lib/utils";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER_ASSIGNMENTS,
  UPDATE_ISSUE_STATUS,
  ALL_ISSUES_AND_USERS,
} from "@/lib/queries.ts";
import { LoadingIssuesList } from "@/components/loading";
import { useUser } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function MyIssues() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const { loading, error, data } = useQuery<{ issues: Issue[] }>(
    GET_USER_ASSIGNMENTS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  );

  const [updateIssueStatus] = useMutation(UPDATE_ISSUE_STATUS, {
    refetchQueries: [
      { query: GET_USER_ASSIGNMENTS, variables: { userId: user?.id } },
      { query: ALL_ISSUES_AND_USERS },
    ],
  });

  if (loading) return <LoadingIssuesList />;
  if (error) {
    toast.error(`Error! ${error.message}`);
    return `Error! ${error.message}`;
  }
  if (!user) {
    toast.error("Please log in to view your issues.");
    return <div>Please log in to view your issues.</div>;
  }

  const issues = data?.issues ?? [];

  const filteredIssues = issues
    .filter((issue: Issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || issue.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a: Issue, b: Issue) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const handleEditIssue = async (issueData: Partial<Issue>) => {
    try {
      if (issueData.status !== "OPEN") {
        await updateIssueStatus({
          variables: {
            id: issueData.id,
            status: issueData.status,
          },
        });
      }

      toast.success("Issue status updated successfully");
    } catch (error) {
      toast.error("Failed to update issue status. Please try again", {
        description: `Error occurred: ${error}`,
      });
    }
  };

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  return (
    <PageLayout title="My Issues" subtitle={`Issues assigned to ${user.name}`}>
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">My Assigned Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search my issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

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
              My Issues ({filteredIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "No issues found matching your criteria."
                    : "You have no assigned issues."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue: Issue) => (
                  <div
                    key={issue.id}
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
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(issue.updatedAt, {
                            addSuffix: true,
                          })}
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
                        Edit Status
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
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        issue={editingIssue}
        onSave={handleEditIssue}
        editMode="status-only"
      />
    </PageLayout>
  );
}
