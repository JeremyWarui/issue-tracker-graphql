"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import type { IssueStatus, Comment, Issue, User as UserType } from "../lib/types";
import {
  ArrowLeft,
  User,
  Calendar,
  MessageSquare,
  Send,
  Edit,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import {useQuery} from "@apollo/client/react";
import {ALL_ISSUES_AND_USERS, GET_ISSUE} from "@/lib/queries.ts";

const statusOptions: { value: IssueStatus; label: string; color: string }[] = [
  { value: "OPEN", label: "Open", color: "secondary" },
  { value: "IN_PROGRESS", label: "In Progress", color: "default" },
  { value: "RESOLVED", label: "Resolved", color: "outline" },
  { value: "CLOSED", label: "Closed", color: "outline" },
];

function getStatusBadgeVariant(status: IssueStatus) {
  const option = statusOptions.find((opt) => opt.value === status);
  return (option?.color) || "secondary";
}

export function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("id: ", id)
  // Find the issue by ID
  const { loading, error, data } = useQuery(GET_ISSUE, {
    variables: { id }
  });
  if (loading) return "loading...";
  if (error) return `Error! ${error.message}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { issue , users } = data;
  console.log("issue Fetched: ", issue);
  console.log("users in list: ", users)


  // State for editing
  // const [status, setStatus] = useState<IssueStatus>(issue?.status || "OPEN");
  // const [assigneeId, setAssigneeId] = useState<string>(
  //   issue?.assignedTo?.id || "unassigned"
  // );
  // const [newComment, setNewComment] = useState("");
  // const [comments, setComments] = useState(issue?.comments || []);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleBack = () => {
    navigate("/issues");
  };

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <Navigation />
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Issue Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The issue you're looking for doesn't exist.
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleBack}
            >
              Back to Issues
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      // authorId: "1", // Mock current user
      author: mockUsers[0], // Mock current user
      issueId: issue.id,
      createdAt: new Date(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleEditIssue = async (issueData: Partial<Issue>) => {
    console.log("Updating issue:", issueData);
    // In a real app, this would make an API call and update the issue
    // For now, just log the data
  };

  const assignedUser = users.find((user: UserType) => user.id === issue.assignedTo);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/issues">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Issues
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Issue Details
                </h1>
                <p className="text-sm text-muted-foreground">
                  Issue #{issue.id}
                </p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-semibold text-foreground">
                        {issue.title}
                      </h2>
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Created {format(issue.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(issue.updatedAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Issue
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">
                    {issue.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comments ({issue.comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Existing Comments */}
                  {issue.comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className="border-l-2 border-border pl-4 py-2"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-md">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}

                  {issue.comments.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No comments yet. Be the first to comment!
                    </p>
                  )}

                  {/* Add Comment */}
                  {/*<div className="border-t pt-4">*/}
                  {/*  <div className="space-y-3">*/}
                  {/*    <Textarea*/}
                  {/*      placeholder="Add a comment..."*/}
                  {/*      value={newComment}*/}
                  {/*      onChange={(e) => setNewComment(e.target.value)}*/}
                  {/*      rows={3}*/}
                  {/*    />*/}
                  {/*    <Button*/}
                  {/*      onClick={handleAddComment}*/}
                  {/*      disabled={!newComment.trim()}*/}
                  {/*      className="bg-blue-600 hover:bg-blue-700"*/}
                  {/*    >*/}
                  {/*      <Send className="h-4 w-4 mr-2" />*/}
                  {/*      Add Comment*/}
                  {/*    </Button>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Assignment */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base">Issue Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={status}
                    onValueChange={(value: IssueStatus) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee Selector */}
                {/*<div className="space-y-2">*/}
                {/*  <label className="text-sm font-medium">Assignee</label>*/}
                {/*  <Select value={assigneeId} onValueChange={setAssigneeId}>*/}
                {/*    <SelectTrigger>*/}
                {/*      <SelectValue placeholder="Select assignee" />*/}
                {/*    </SelectTrigger>*/}
                {/*    <SelectContent>*/}
                {/*      <SelectItem value="unassigned">Unassigned</SelectItem>*/}
                {/*      {mockUsers.map((user) => (*/}
                {/*        <SelectItem key={user.id} value={user.id}>*/}
                {/*          {user.name}*/}
                {/*        </SelectItem>*/}
                {/*      ))}*/}
                {/*    </SelectContent>*/}
                {/*  </Select>*/}
                {/*</div>*/}

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Issue Info */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base">Issue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assignee:</span>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>
                      {assignedUser ? assignedUser.name : "Unassigned"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={getStatusBadgeVariant(status)}
                    className="text-xs"
                  >
                    {status.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comments:</span>
                  <span>{issue.comments.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(issue.createdAt, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{format(issue.updatedAt, "MMM d, yyyy")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {/*<IssueModal*/}
      {/*  open={isEditModalOpen}*/}
      {/*  onOpenChange={setIsEditModalOpen}*/}
      {/*  issue={issue}*/}
      {/*  onSave={handleEditIssue}*/}
      {/*/>*/}
    </div>
  );
}
