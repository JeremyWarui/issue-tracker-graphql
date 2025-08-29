import { Navigation } from "../NavigationBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingUsers() {
  return (
    <div className="min-h-screen bg-slate-100" role="status" aria-label="Loading users">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-1" aria-hidden="true" />
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </div>
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* User Management Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row justify-between">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </CardContent>
          </Card>

          {/* Users List Card */}
          <Card className="bg-white">
            <CardHeader>
              <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-6 border rounded-lg bg-white space-y-4">
                    {/* User avatar and info */}
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" aria-hidden="true" />
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      </div>
                    </div>
                    
                    {/* Role badge */}
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                    
                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                    </div>
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
