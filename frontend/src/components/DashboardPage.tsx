import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "./NavigationBar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

// use data from GraphQL
import { useQuery } from "@apollo/client/react";
import { ALL_ISSUES_AND_USERS } from "@/lib/queries.ts";
import type { Issue } from "@/lib/types.ts";

function getStatusIcon(status: string) {
  switch (status) {
    case "OPEN":
      return AlertCircle;
    case "IN_PROGRESS":
      return Clock;
    case "RESOLVED":
      return CheckCircle;
    case "CLOSED":
      return XCircle;
    case "ASSIGNED":
      return FileText;
    default:
      return FileText;
  }
}

function getStatusBadgeColor(status: string) {
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

export function Dashboard() {
  const { loading, error, data } = useQuery(ALL_ISSUES_AND_USERS);
  if (loading) return "loading...";
  if (error) return `Error! ${error.message}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { issues } = data;

  console.log("issues: ", issues);
  // Get recent issues (last 5 updated)
  const recentIssues: Issue[] = [...issues]
    .sort(
      (a: Issue, b: Issue) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  console.log("recent issues: ", recentIssues);

  const stats = {
    total: issues.length,
    open: issues.filter((issue: Issue) => issue.status === "OPEN").length,
    inProgress: issues.filter((issue: Issue) => issue.status === "IN_PROGRESS")
      .length,
    closed: issues.filter((issue: Issue) => issue.status === "CLOSED").length,
    resolved: issues.filter((issue: Issue) => issue.status === "RESOLVED")
      .length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Issue Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and track your team's issues efficiently
              </p>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-7 w-7 text-red-500" />
                      <div className="text-lg font-bold text-muted-foreground">
                        Open
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.open}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-7 w-7 text-blue-500" />
                      <div className="text-lg font-bold text-muted-foreground">
                        In Progress
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.inProgress}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-7 w-7 text-green-500" />
                      <div className="text-lg font-bold text-muted-foreground">
                        Resolved
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.resolved}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-7 w-7 text-gray-500" />
                      <div className="text-lg font-bold text-muted-foreground">
                        Closed
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.closed}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentIssues.map((issue, index) => {
                    const StatusIcon = getStatusIcon(issue.status);
                    return (
                      <div key={issue.id}>
                        <div className="flex items-center space-x-3 py-2">
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-LG font-bold text-foreground truncate">
                              {issue.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                className={`text-xs ${getStatusBadgeColor(
                                  issue.status
                                )}`}
                              >
                                {issue.status.replace("-", " ")}
                              </Badge>
                              {issue.assignedTo && (
                                <span className="text-xs text-muted-foreground">
                                  {issue.assignedTo.name}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(issue.updatedAt, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < recentIssues.length - 1 && (
                          <hr className="border-gray-200" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
