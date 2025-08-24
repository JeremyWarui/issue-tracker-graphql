import { Navigation } from "./NavigationBar";

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function PageLayout({ title, subtitle, children, headerAction }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {headerAction ? (
              <div className="flex items-center space-x-4">
                {headerAction}
                <Navigation />
              </div>
            ) : (
              <Navigation />
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
