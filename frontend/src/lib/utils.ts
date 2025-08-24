import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { IssueStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status configuration constants
export const STATUS_OPTIONS: { value: IssueStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "ASSIGNED", label: "Assigned" },
];

export const STATUS_OPTIONS_WITH_ALL: { value: IssueStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  ...STATUS_OPTIONS,
];

// Status badge color utility function
export function getStatusBadgeColor(status: IssueStatus): string {
  switch (status) {
    case "OPEN":
      return "text-red-700 bg-red-100 border-red-200";
    case "IN_PROGRESS":
      return "text-blue-700 bg-blue-100 border-blue-200";
    case "RESOLVED":
      return "text-green-700 bg-green-100 border-green-200";
    case "CLOSED":
      return "text-gray-700 bg-gray-100 border-gray-200";
    case "ASSIGNED":
      return "text-amber-700 bg-amber-100 border-amber-200";
    default:
      return "";
  }
}
