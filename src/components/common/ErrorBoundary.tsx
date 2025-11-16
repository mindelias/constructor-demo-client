import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          {this.state.error && (
            <pre className="text-xs bg-muted p-4 rounded-md mb-4 max-w-2xl overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
