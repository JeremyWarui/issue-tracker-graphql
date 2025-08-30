"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LOGIN_USER } from "@/lib/queries";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

interface LoginFormProps {
  setToken: (token: string) => void;
}

interface LoginMutationResult {
  login: {
    value: string;
  };
}

export function LoginForm({ setToken }: LoginFormProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [login, result] = useMutation<LoginMutationResult>(LOGIN_USER);

  useEffect(() => {
    if (result.data) {
      const token = result.data?.login?.value;
      console.log("login form token: ", token);

      setToken(token);
      localStorage.setItem("issuesTrackerUser", token);
    }
  }, [result.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login({
        variables: { name, identifier: password },
      });
      // console.log(success);

      if (success) {
        toast.success("Login Successful!", {
          description: "Welcome back!🎉 "
        });
        navigate("/");
      } else {
        toast.error("Login failed, try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error:", error.message);
        toast.error(`${error.message}`);
      } else {
        console.log("error:", error);
        toast.error(`${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription>
            Enter your credentials to access the issue tracker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-bold"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
