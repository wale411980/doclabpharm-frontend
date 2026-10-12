import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * DOCLAB_ERROR_BOUNDARY_V1
 *
 * The application had no error boundary, so any uncaught error thrown during
 * render unmounted the entire React tree and left the user on a blank white
 * page with no indication of what had happened. This catches those errors,
 * keeps the page readable, and surfaces the message so it can be reported.
 */

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info });
    console.error("Uncaught render error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            Something went wrong on this page
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            The page could not be displayed. You can try again, or go back to
            the home page. If this keeps happening, please report the details
            below.
          </p>

          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Error</p>
            <p className="mt-1 break-words font-mono text-sm text-red-700">
              {error.message || String(error)}
            </p>
          </div>

          {info?.componentStack ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-slate-500">
                Technical details
              </summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-900 p-3 text-xs text-slate-100">
                {info.componentStack}
              </pre>
            </details>
          ) : null}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Go to home page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
