"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/types"

interface UserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
    onSave: (userData: Partial<User>) => void
}

export function UserModal({ open, onOpenChange, user, onSave }: UserModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const isEditing = !!user

    // Reset form when modal opens/closes or user changes
    useEffect(() => {
        if (open) {
            if (user) {
                // Editing existing user
                setName(user.name)
                setEmail(user.email || "")
            } else {
                // Creating new user
                setName("")
                setEmail("")
            }
        }
    }, [open, user])

    const handleSave = async () => {
        if (!name.trim()) {
            return
        }

        setIsLoading(true)

        const userData: Partial<User> = {
            name: name.trim(),
            email: email.trim() || undefined,
        }

        if (isEditing && user) {
            userData.id = user.id
        }

        try {
            await onSave(userData)
            onOpenChange(false)
        } catch (error) {
            console.error("Error saving user:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit User" : "Create New User"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter user name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim() || isLoading} className="min-w-[80px]">
                        {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
