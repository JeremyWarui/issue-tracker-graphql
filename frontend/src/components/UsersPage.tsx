"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { UserModal } from "@/components/user-modal"
import { mockUsers, mockIssues } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import { Plus, UserIcon, Mail, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export default function UsersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Calculate assigned issues count for each user
    const usersWithIssueCount = mockUsers.map((user) => ({
        ...user,
        assignedIssuesCount: mockIssues.filter((issue) => issue.assigneeId === user.id).length,
    }))

    const handleCreateUser = async (userData: Partial<User>) => {
        console.log("Creating user:", userData)
        // In a real app, this would make an API call to create the user
    }

    const handleEditUser = async (userData: Partial<User>) => {
        console.log("Updating user:", userData)
        // In a real app, this would make an API call to update the user
    }

    const openEditModal = (user: User) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    const handleDeleteUser = (userId: string) => {
        console.log("Deleting user:", userId)
        // In a real app, this would show a confirmation dialog and then delete the user
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Users</h1>
                            <p className="text-sm text-muted-foreground">Manage team members and user accounts</p>
                        </div>
                        <Navigation />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="space-y-6">
                    {/* Top Bar */}
                    <Card className="bg-white">
                        <CardHeader>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <CardTitle className="text-lg">User Management</CardTitle>
                                <Button onClick={() => setIsCreateModalOpen(true)} className="w-fit bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create User
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Users Table */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-base">Team Members ({usersWithIssueCount.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {usersWithIssueCount.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 hover:bg-white transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-medium text-foreground">#{user.id}</h3>
                                                    <span className="text-foreground font-medium">{user.name}</span>
                                                    {user.assignedIssuesCount > 0 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {user.assignedIssuesCount} issue{user.assignedIssuesCount !== 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    {user.email && (
                                                        <div className="flex items-center space-x-1">
                                                            <Mail className="h-3 w-3" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    )}
                                                    <span>Joined {format(user.createdAt, "MMM d, yyyy")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{usersWithIssueCount.length}</div>
                                    <div className="text-sm text-muted-foreground">Total Users</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">
                                        {usersWithIssueCount.filter((user) => user.assignedIssuesCount > 0).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Active Users</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">
                                        {usersWithIssueCount.reduce((total, user) => total + user.assignedIssuesCount, 0)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Assignments</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Create User Modal */}
            <UserModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleCreateUser} />

            {/* Edit User Modal */}
            <UserModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} user={editingUser} onSave={handleEditUser} />
        </div>
    )
}
