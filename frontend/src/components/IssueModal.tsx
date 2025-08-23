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
import { mockUsers } from "@/lib/mock-data";
import type {Issue, IssueStatus, User} from "@/lib/types";

interface IssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue?: Issue | null;
  onSave: (issueData: Partial<Issue>) => void;
}

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export function IssueModal({
  open,
  onOpenChange,
  issue,
  onSave,
}: IssueModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("OPEN");
  const [assigneeId, setAssigneeId] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!issue;

  // Reset form when modal opens/closes or issue changes
  useEffect(() => {
    if (open) {
      if (issue) {
        // Editing existing issue
        setTitle(issue.title);
        setDescription(issue.description);
        setStatus(issue.status);
        setAssigneeId(issue.assignedTo);
      } else {
        // Creating new issue
        setTitle("");
        setDescription("");
      }
    }
  }, [open, issue]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    setIsLoading(true);

    const issueData: Partial<Issue> = {
      title: title.trim(),
      description: description.trim(),
      status,
      // assigneeId: assigneeId === "unassigned" ? undefined : assigneeId,
    };

    if (isEditing && issue) {
      issueData.id = issue.id;
    }

    try {
      await onSave(issueData);
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
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Field */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
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
                {mockUsers.map((user) => (
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
