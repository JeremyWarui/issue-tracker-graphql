"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "./PageLayout";
import { UserModal } from "./UserModal";
import type { User } from "../lib/types";
import { Plus, UserIcon, Mail, Edit, Trash2 } from "lucide-react";


// use data from GraphQL
import { useQuery } from "@apollo/client/react";
import { ALL_USERS } from "@/lib/queries.ts";

export function UsersList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  //fetch users and issues
  const { loading, error, data } = useQuery(ALL_USERS);
  if (loading) return "loading...";
  if (error) return `Error! ${error.message}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { users } = data;

  // Calculate assigned issues count for each user
  const usersWithIssueCount = users.map((user: User) => ({
    ...user,
    assignedIssuesCount: user.assignedIssues.length,
  }));
  console.log("users with issue count: " , usersWithIssueCount)

  const handleCreateUser = async (userData: Partial<User>) => {
    console.log("Creating user:", userData);
    // In a real app, this would make an API call to create the user
  };

  const handleEditUser = async (userData: Partial<User>) => {
    console.log("Updating user:", userData);
    // In a real app, this would make an API call to update the user
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Deleting user:", userId);
    // In a real app, this would show a confirmation dialog and then delete the user
  };

  return (
    <PageLayout 
      title="Users" 
      subtitle="Manage team members and user accounts"
      headerAction={
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-fit bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Top Bar */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          </Card>

           {/* User Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {usersWithIssueCount.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Users
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {
                      usersWithIssueCount.filter(
                        (user: User) => user.assignedIssues.length > 0
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {usersWithIssueCount.reduce(
                      (total: number, user: User) => total + user.assignedIssues.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Assignments
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base">
                Team Members ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usersWithIssueCount.map((user: User) => (
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
                          {/* <h3 className="font-medium text-foreground">
                            #{user.id}
                          </h3> */}
                          <span className="text-foreground font-medium">
                            {user.name}
                          </span>
                          {user.assignedIssues.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {user.assignedIssues.length} issue
                              {user.assignedIssues.length !== 1 ? "s" : ""}
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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
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

        </div>

        {/* Create User Modal */}
        <UserModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSave={handleCreateUser}
        />

        {/* Edit User Modal */}
        <UserModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={editingUser}
          onSave={handleEditUser}
        />
      </PageLayout>
  );
}
