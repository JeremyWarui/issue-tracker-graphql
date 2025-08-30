import { Navigation } from "../NavigationBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingIssuesList() {
  return (
    <div className="min-h-screen bg-slate-100" role="status" aria-label="Loading issues list">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-1" aria-hidden="true" />
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
          {/* Issue Management Card */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row justify-between">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                {/* Search bar */}
                <div className="flex-1">
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                </div>
                
                {/* Filter dropdowns */}
                <div className="flex space-x-4">
                  <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                  <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List Card */}
          <Card className="bg-white">
            <CardHeader>
              <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Issue list items */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-5 w-64 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
