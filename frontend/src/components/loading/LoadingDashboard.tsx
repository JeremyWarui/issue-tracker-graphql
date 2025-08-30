import { Navigation } from "../NavigationBar";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-slate-100" role="status" aria-label="Loading dashboard">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-1" aria-hidden="true" />
              <div className="h-4 w-80 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
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
        <div className="space-y-8">
          {/* Status Overview Section */}
          <div>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4" aria-hidden="true" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-7 w-7 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                      </div>
                      <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4" aria-hidden="true" />
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <div className="flex items-center space-x-3 py-2">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded mb-1" aria-hidden="true" />
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                      {i < 5 && <hr className="border-gray-200" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
