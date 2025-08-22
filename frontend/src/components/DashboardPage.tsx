import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { mockStats, mockIssues } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { FileText, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

function StatCard({
                      title,
                      value,
                      icon: Icon,
                      description,
                  }: {
    title: string
    value: number
    icon: React.ElementType
    description?: string
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case "open":
            return "secondary"
        case "in-progress":
            return "default"
        case "resolved":
            return "default"
        case "closed":
            return "outline"
        default:
            return "secondary"
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case "open":
            return AlertCircle
        case "in-progress":
            return Clock
        case "resolved":
            return CheckCircle
        case "closed":
            return XCircle
        default:
            return FileText
    }
}

function getStatusBadgeColor(status: string) {
    switch (status) {
        case "open":
            return "text-orange-700 bg-orange-100 border-orange-200"
        case "in-progress":
            return "text-blue-700 bg-blue-100 border-blue-200"
        case "resolved":
            return "text-green-700 bg-green-100 border-green-200"
        case "closed":
            return "text-gray-700 bg-gray-100 border-gray-200"
        default:
            return ""
    }
}

export default function DashboardPage() {
    // Get recent issues (last 5 updated)
    const recentIssues = mockIssues.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5)

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Issue Tracker</h1>
                            <p className="text-sm text-muted-foreground">Manage and track your team's issues efficiently</p>
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
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <div className="text-2xl font-bold">{mockStats.open}</div>
                                            <div className="text-sm text-muted-foreground">Open</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <div className="text-2xl font-bold">{mockStats.inProgress}</div>
                                            <div className="text-sm text-muted-foreground">In Progress</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <div>
                                            <div className="text-2xl font-bold">{mockStats.resolved}</div>
                                            <div className="text-sm text-muted-foreground">Resolved</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3">
                                        <XCircle className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <div className="text-2xl font-bold">{mockStats.closed}</div>
                                            <div className="text-sm text-muted-foreground">Closed</div>
                                        </div>
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
                                    {recentIssues.map((issue) => {
                                        const StatusIcon = getStatusIcon(issue.status)
                                        return (
                                            <div key={issue.id} className="flex items-center space-x-3 py-2">
                                                <StatusIcon className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{issue.title}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge
                                                            variant={getStatusBadgeVariant(issue.status)}
                                                            className={`text-xs ${getStatusBadgeColor(issue.status)}`}
                                                        >
                                                            {issue.status.replace("-", " ")}
                                                        </Badge>
                                                        {issue.assignee && (
                                                            <span className="text-xs text-muted-foreground">{issue.assignee.name}</span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(issue.updatedAt, { addSuffix: true })}
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
