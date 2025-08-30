import { Navigation } from "../NavigationBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingIssue() {
  return (
    <div
      className="min-h-screen bg-slate-100"
      role="status"
      aria-label="Loading issue details"
    >
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back button skeleton */}
              <div
                className="h-10 w-10 bg-gray-200 animate-pulse rounded"
                aria-hidden="true"
              />
              <div className="">
                <div
                  className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-1"
                  aria-hidden="true"
                />
                <div
                  className="h-4 w-32 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div
                  className="h-4 w-24 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
                <div
                  className="h-8 w-16 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue details card */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div
                      className="h-8 w-96 bg-gray-200 animate-pulse rounded"
                      aria-hidden="true"
                    />
                    <div className="flex items-center space-x-4">
                      <div
                        className="h-5 w-16 bg-gray-200 animate-pulse rounded"
                        aria-hidden="true"
                      />
                      <div
                        className="h-4 w-24 bg-gray-200 animate-pulse rounded"
                        aria-hidden="true"
                      />
                      <div
                        className="h-4 w-32 bg-gray-200 animate-pulse rounded"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div
                    className="h-10 w-20 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="h-4 w-full bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Comments section */}
            <Card className="bg-white">
              <CardHeader>
                <div
                  className="h-6 w-32 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Comment skeleton items */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="space-y-2 p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-24 bg-gray-200 animate-pulse rounded"
                          aria-hidden="true"
                        />
                        <div
                          className="h-4 w-32 bg-gray-200 animate-pulse rounded"
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className="h-4 w-full bg-gray-200 animate-pulse rounded"
                        aria-hidden="true"
                      />
                      <div
                        className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"
                        aria-hidden="true"
                      />
                    </div>
                  ))}

                  {/* Add comment skeleton */}
                  <div className="space-y-2 pt-4 border-t">
                    <div
                      className="h-20 w-full bg-gray-200 animate-pulse rounded"
                      aria-hidden="true"
                    />
                    <div
                      className="h-10 w-24 bg-gray-200 animate-pulse rounded"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue metadata card */}
            <Card className="bg-white">
              <CardHeader>
                <div
                  className="h-6 w-24 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div
                    className="h-4 w-16 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-8 w-full bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className="h-4 w-20 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-8 w-full bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className="h-4 w-16 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-4 w-32 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className="h-4 w-20 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                  <div
                    className="h-4 w-28 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions card */}
            <Card className="bg-white">
              <CardHeader>
                <div
                  className="h-6 w-16 bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="h-10 w-full bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
                <div
                  className="h-10 w-full bg-gray-200 animate-pulse rounded"
                  aria-hidden="true"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
