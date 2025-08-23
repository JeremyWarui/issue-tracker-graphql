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
import { Navigation } from "./NavigationBar";
import { IssueModal } from "./IssueModal";
import { mockIssues, mockUsers } from "../lib/mock-data";
import type { IssueStatus, Issue } from "../lib/types";
import { Search, Plus, Eye, Edit, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusOptions: { value: IssueStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

function getStatusBadgeColor(status: IssueStatus) {
  switch (status) {
    case "open":
      return "text-red-700 bg-red-100 border-red-200";
    case "in-progress":
      return "text-blue-700 bg-blue-100 border-blue-200";
    case "resolved":
      return "text-green-700 bg-green-100 border-green-200";
    case "closed":
      return "text-gray-700 bg-gray-100 border-gray-200";
    default:
      return "";
  }
}

export function IssuesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !issue.assignee) ||
      (issue.assignee && issue.assignee.id === assigneeFilter);
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleCreateIssue = async (issueData: Partial<Issue>) => {
    console.log("Creating issue:", issueData);
  };

  const handleEditIssue = async (issueData: Partial<Issue>) => {
    console.log("Updating issue:", issueData);
  };

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Issues</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage all project issues
              </p>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle className="text-2xl">Issue Management</CardTitle>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-fit bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Issue
                </Button>
              </div>
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

                <Select
                  value={assigneeFilter}
                  onValueChange={setAssigneeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  {statusOptions.map((option) => (
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
                  {filteredIssues.map((issue) => (
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
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>
                              {issue.assignee
                                ? issue.assignee.name
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
      </main>

      <IssueModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCreateIssue}
      />

      <IssueModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        issue={editingIssue}
        onSave={handleEditIssue}
      />
    </div>
  );
}
