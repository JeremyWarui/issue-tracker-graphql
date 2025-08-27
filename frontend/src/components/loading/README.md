# Loading Components Usage Guide

## Quick Start

### Basic Import and Usage

```tsx
import { LoadingDashboard, LoadingSpinner } from '@/components/loading';

function MyComponent() {
  const { loading, data, error } = useQuery(MY_QUERY);
  
  if (loading) return <LoadingDashboard />;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Your component content */}</div>;
}
```

### Available Components

| Component | Use Case | Description |
|-----------|----------|-------------|
| `LoadingDashboard` | Dashboard page | Full dashboard layout with status cards and activity |
| `LoadingIssuesList` | Issues list page | Issues list with search/filter controls |
| `LoadingIssue` | Issue detail page | Issue detail with sidebar and comments |
| `LoadingUsers` | Users page | Users grid with stats cards |
| `LoadingSpinner` | Generic loading | Customizable spinner component |
| `LoadingCard` | Card content | Loading state for individual cards |
| `LoadingIssueItem` | Issue list items | Skeleton for individual issue items |

### Advanced Usage

```tsx
import { 
  LoadingSpinner, 
  LoadingCard,
  type LoadingSpinnerProps 
} from '@/components/loading';

// Custom loading component with different sizes
function CustomLoader({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center p-4">
      <LoadingSpinner 
        size={size} 
        aria-label="Loading custom content" 
      />
    </div>
  );
}

// Conditional loading states
function DataComponent() {
  const { loading, data } = useQuery(QUERY);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }
  
  return <DataDisplay data={data} />;
}
```

## Best Practices

1. **Use page-specific loaders** for full page loading states
2. **Use LoadingCard** for individual content sections
3. **Use LoadingSpinner** for buttons or small UI elements
4. **Always include aria-label** for accessibility
5. **Match the loading structure** to your actual content layout
