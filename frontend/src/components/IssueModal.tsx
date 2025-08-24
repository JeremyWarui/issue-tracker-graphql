"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Issue, IssueStatus, User } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/utils";

interface IssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue?: Issue | null;
  users?: User[];
  onSave: (issueData: Partial<Issue>) => void;
}

export function IssueModal({
  open,
  onOpenChange,
  issue,
  users = [],
  onSave,
}: IssueModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("OPEN");
  const [assigneeId, setAssigneeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!issue;

  // console.log("users passed on: ", users)

  // Reset form when modal opens/closes or issue changes
  useEffect(() => {
    if (open) {
      if (issue) {
        // Editing existing issue
        setTitle(issue.title);
        setDescription(issue.description);
        setStatus(issue.status);
        setAssigneeId(issue.assignedTo?.id ?? "unassigned");
      } else {
        // Creating new issue
        setTitle("");
        setDescription("");
        setStatus("OPEN");
        setAssigneeId("unassigned");
      }
    }
  }, [open, issue]);

  // console.log("issue: ", issue)
  // console.log("title: ", title)
  // console.log("desc: ", description)
  // console.log("status: ", status)
  // console.log("assignedTo: ", assigneeId)

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }
    const selectedUser = users.find((u) => u.id === assigneeId);

    setIsLoading(true);

    const issueData: Partial<Issue> = {
      title: title.trim(),
      description: description.trim(),
      status,
      assignedTo: assigneeId === "unassigned" ? undefined : selectedUser,
    };

    if (isEditing && issue) {
      issueData.id = issue.id;
    }

    try {
      onSave(issueData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Issue" : "Create New Issue"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter issue title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: IssueStatus) => setStatus(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Field */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assigned To</Label>
            <Select
              value={assigneeId}
              onValueChange={setAssigneeId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users.map((user: User) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !description.trim() || isLoading}
            className="min-w-[80px] bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
